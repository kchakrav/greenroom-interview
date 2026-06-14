"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal } from "lucide-react";
import { runJavaScript } from "@/lib/runCode";

const LANGS = [
  { id: "javascript", label: "JavaScript", runnable: true },
  { id: "typescript", label: "TypeScript", runnable: false },
  { id: "python", label: "Python", runnable: false },
  { id: "java", label: "Java", runnable: false },
  { id: "cpp", label: "C++", runnable: false },
  { id: "go", label: "Go", runnable: false },
  { id: "sql", label: "SQL", runnable: false },
];

const STARTERS: Record<string, string> = {
  javascript: "// Write your solution here. Use console.log to print.\nfunction solve(input) {\n  \n}\n\nconsole.log(solve());\n",
  typescript: "// Write your solution here.\nfunction solve(input: unknown) {\n  \n}\n",
  python: "# Write your solution here.\ndef solve(input):\n    pass\n",
  java: "class Solution {\n    // Write your solution here.\n}\n",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here.\n}\n",
  go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Write your solution here.\n}\n",
  sql: "-- Write your query here.\nSELECT 1;\n",
};

export interface CodeState {
  language: string;
  code: string;
  output: string;
}

export default function CodeStage({
  state,
  onChange,
}: {
  state: CodeState;
  onChange: (s: CodeState) => void;
}) {
  const [running, setRunning] = useState(false);
  const lang = LANGS.find((l) => l.id === state.language) ?? LANGS[0];

  async function run() {
    if (lang.id !== "javascript") {
      onChange({ ...state, output: `▶ ${lang.label} runs server-side in production. Here, submit your code and the interviewer will review it.` });
      return;
    }
    setRunning(true);
    const res = await runJavaScript(state.code);
    setRunning(false);
    onChange({ ...state, output: res.output });
  }

  function setLanguage(id: string) {
    const blank = !state.code.trim() || Object.values(STARTERS).includes(state.code);
    onChange({ language: id, code: blank ? STARTERS[id] ?? "" : state.code, output: "" });
  }

  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-hair px-3 py-2">
        <select
          value={state.language}
          onChange={(e) => setLanguage(e.target.value)}
          className="cursor-pointer rounded-lg bg-transparent px-2 py-1 text-sm text-ink-secondary focus:outline-none"
        >
          {LANGS.map((l) => (
            <option key={l.id} value={l.id} className="bg-elevated text-ink-primary">{l.label}</option>
          ))}
        </select>
        <button onClick={run} disabled={running} className="btn-accent flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          {lang.runnable ? "Run" : "Check"}
        </button>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          language={state.language}
          theme="vs-dark"
          value={state.code}
          onChange={(v) => onChange({ ...state, code: v ?? "" })}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            automaticLayout: true,
          }}
        />
      </div>
      {state.output && (
        <div className="max-h-40 overflow-auto border-t border-hair bg-black/30 px-3 py-2">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-muted"><Terminal className="h-3 w-3" /> Output</div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-ink-secondary">{state.output}</pre>
        </div>
      )}
    </div>
  );
}

export const STARTER_CODE = STARTERS;
