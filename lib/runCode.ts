"use client";
// Lightweight, sandboxed JavaScript runner using a Web Worker with a timeout,
// so infinite loops can't freeze the page. JS only — other languages are
// submitted to the AI for review without local execution (no server sandbox).

export interface RunResult {
  output: string;
  ok: boolean;
}

const WORKER_SRC = `
self.onmessage = (e) => {
  const logs = [];
  const fmt = (a) => a.map(x => {
    try { return typeof x === "object" ? JSON.stringify(x) : String(x); }
    catch { return String(x); }
  }).join(" ");
  const console = {
    log: (...a) => logs.push(fmt(a)),
    error: (...a) => logs.push("Error: " + fmt(a)),
    warn: (...a) => logs.push(fmt(a)),
    info: (...a) => logs.push(fmt(a)),
  };
  try {
    const fn = new Function("console", e.data);
    const ret = fn(console);
    if (ret !== undefined) logs.push(String(ret));
    self.postMessage({ output: logs.join("\\n") || "(ran with no output)", ok: true });
  } catch (err) {
    self.postMessage({ output: (logs.length ? logs.join("\\n") + "\\n" : "") + "Error: " + (err && err.message ? err.message : String(err)), ok: false });
  }
};
`;

export function runJavaScript(code: string, timeoutMs = 3000): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
    } catch {
      resolve({ output: "Could not start the runner in this browser.", ok: false });
      return;
    }
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ output: "⏱️ Timed out (possible infinite loop).", ok: false });
    }, timeoutMs);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data as RunResult);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ output: "Error: " + e.message, ok: false });
    };
    worker.postMessage(code);
  });
}
