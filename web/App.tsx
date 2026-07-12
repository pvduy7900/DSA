import { useCallback, useEffect, useMemo, useState } from "react";
import { GuidePanel } from "./GuidePanel";
import type { Bank, ExerciseGuide, Problem, Solution, TestResult } from "./types";

const CODE_STORAGE_KEY = "dsa-code-drafts";

function loadDrafts(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CODE_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveDraft(problemId: string, code: string) {
  const drafts = loadDrafts();
  drafts[problemId] = code;
  localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify(drafts));
}

export function App() {
  const [bank, setBank] = useState<Bank | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [summary, setSummary] = useState<{ passed: number; total: number } | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<"problem" | "guide">("problem");
  const [guide, setGuide] = useState<ExerciseGuide | null>(null);
  const [guideExtras, setGuideExtras] = useState<ExerciseGuide[]>([]);

  const loadGuide = useCallback(async (problemId: string) => {
    try {
      const res = await fetch(`/api/guide/${problemId}`);
      if (!res.ok) {
        setGuide(null);
        setGuideExtras([]);
        return;
      }
      const data = await res.json();
      setGuide(data.guide);
      setGuideExtras(data.extras ?? []);
    } catch {
      setGuide(null);
      setGuideExtras([]);
    }
  }, []);

  const selectProblem = useCallback(async (problem: Problem) => {
    setSelectedProblem(problem);
    setSelectedTopic(problem.topic);
    setResults(null);
    setSummary(null);
    setSolution(null);
    setShowSolution(false);
    setError(null);
    setLeftTab("guide");

    void loadGuide(problem.id);

    const drafts = loadDrafts();
    if (drafts[problem.id]) {
      setCode(drafts[problem.id]);
      return;
    }

    try {
      const res = await fetch(`/api/starter/${problem.id}`);
      const data = await res.json();
      setCode(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load starter code");
    }
  }, [loadGuide]);

  useEffect(() => {
    fetch("/api/bank")
      .then((res) => res.json())
      .then((data: Bank) => {
        setBank(data);
        const firstTopic = Object.keys(data.topics)[0];
        const firstProblem = data.problems.find((p) => p.topic === firstTopic);
        if (firstProblem) {
          selectProblem(firstProblem);
        }
      })
      .catch((err) => setError(err.message));
  }, [selectProblem]);

  const problemsByTopic = useMemo(() => {
    if (!bank) return {};
    return bank.problems.reduce<Record<string, Problem[]>>((acc, problem) => {
      acc[problem.topic] ??= [];
      acc[problem.topic].push(problem);
      return acc;
    }, {});
  }, [bank]);

  const topicProblems = selectedTopic ? problemsByTopic[selectedTopic] ?? [] : [];

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (selectedProblem) {
      saveDraft(selectedProblem.id, value);
    }
  };

  const runTests = async () => {
    if (!selectedProblem) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setSummary(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: selectedProblem.id, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      setResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const resetCode = async () => {
    if (!selectedProblem) return;
    const res = await fetch(`/api/starter/${selectedProblem.id}`);
    const data = await res.json();
    setCode(data.code);
    saveDraft(selectedProblem.id, data.code);
    setResults(null);
    setSummary(null);
    setShowSolution(false);
    setSolution(null);
  };

  const loadSolution = async () => {
    if (!selectedProblem) return;
    const res = await fetch(`/api/solution/${selectedProblem.id}`);
    const data = await res.json();
    setSolution(data);
    setShowSolution(true);
  };

  const nextProblem = () => {
    if (!selectedProblem || !topicProblems.length) return;
    const index = topicProblems.findIndex((p) => p.id === selectedProblem.id);
    const next = topicProblems[(index + 1) % topicProblems.length];
    selectProblem(next);
  };

  const randomProblem = () => {
    if (!bank) return;
    const problem = bank.problems[Math.floor(Math.random() * bank.problems.length)];
    setSelectedTopic(problem.topic);
    selectProblem(problem);
  };

  if (error && !bank) {
    return (
      <div className="app-shell">
        <div className="error-banner">Failed to load: {error}</div>
      </div>
    );
  }

  if (!bank || !selectedProblem) {
    return (
      <div className="app-shell">
        <div className="loading">Loading DSA Practice...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">{"{ }"}</span>
          <div>
            <h1>DSA Practice</h1>
            <p>Interactive challenges</p>
          </div>
        </div>

        <button className="random-btn" onClick={randomProblem}>
          Random Problem
        </button>

        <nav className="topic-list">
          {Object.entries(bank.topics).map(([key, meta]) => (
            <div key={key} className="topic-group">
              <button
                className={`topic-btn ${selectedTopic === key ? "active" : ""}`}
                onClick={() => setSelectedTopic(key)}
              >
                <span>{meta.name}</span>
                <span className="count">{problemsByTopic[key]?.length ?? 0}</span>
              </button>
              {selectedTopic === key && (
                <div className="problem-list">
                  {topicProblems.map((problem) => (
                    <button
                      key={problem.id}
                      className={`problem-btn ${selectedProblem.id === problem.id ? "active" : ""}`}
                      onClick={() => selectProblem(problem)}
                    >
                      {problem.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="problem-header">
          <div>
            <p className="topic-label">{bank.topics[selectedProblem.topic].name}</p>
            <h2>{selectedProblem.title}</h2>
          </div>
          <div className="actions">
            <button className="btn secondary" onClick={resetCode}>
              Reset
            </button>
            <button className="btn secondary" onClick={loadSolution}>
              Solution
            </button>
            <button className="btn secondary" onClick={nextProblem}>
              Next
            </button>
            <button className="btn primary" onClick={runTests} disabled={loading}>
              {loading ? "Running..." : "Run Tests"}
            </button>
          </div>
        </header>

        <div className="content-grid">
          <section className="panel problem-panel">
            <div className="panel-tabs">
              <button
                className={`tab-btn ${leftTab === "guide" ? "active" : ""}`}
                onClick={() => setLeftTab("guide")}
              >
                Giải thích
              </button>
              <button
                className={`tab-btn ${leftTab === "problem" ? "active" : ""}`}
                onClick={() => setLeftTab("problem")}
              >
                Bài tập
              </button>
            </div>

            {leftTab === "guide" && guide ? (
              <GuidePanel guide={guide} extras={guideExtras} />
            ) : leftTab === "guide" ? (
              <p className="guide-loading">Đang tải hướng dẫn...</p>
            ) : (
              <>
                <h3>Problem</h3>
                <p className="statement">{selectedProblem.statement}</p>

                <h4>Constraints</h4>
                <ul>
                  {selectedProblem.constraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>

                <h4>Examples</h4>
                {selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="example-card">
                    <div>
                      <span className="label">Input</span>
                      <code>{ex.input}</code>
                    </div>
                    <div>
                      <span className="label">Output</span>
                      <code>{ex.output}</code>
                    </div>
                    {ex.explanation && <p className="explanation">{ex.explanation}</p>}
                  </div>
                ))}
              </>
            )}
          </section>

          <section className="panel editor-panel">
            <div className="editor-header">
              <h3>Your Solution</h3>
              <span className="file-name">{selectedProblem.starter_file}</span>
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
            />
          </section>
        </div>

        {(results || error) && (
          <section className="panel results-panel">
            <div className="results-header">
              <h3>Test Results</h3>
              {summary && (
                <span className={`badge ${summary.passed === summary.total ? "pass" : "fail"}`}>
                  {summary.passed}/{summary.total} passed
                </span>
              )}
            </div>

            {error && <div className="error-banner">{error}</div>}

            {results && (
              <div className="results-list">
                {results.map((result) => (
                  <div key={result.case} className={`result-row ${result.passed ? "pass" : "fail"}`}>
                    <span className="status">{result.passed ? "PASS" : "FAIL"}</span>
                    <span className="case">Case {result.case}</span>
                    {!result.passed && (
                      <div className="diff">
                        <div>
                          <strong>Expected:</strong> {JSON.stringify(result.expected)}
                        </div>
                        <div>
                          <strong>Got:</strong> {JSON.stringify(result.actual)}
                        </div>
                        {result.failingOp && (
                          <div>
                            <strong>Failed at:</strong> {result.failingOp}()
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {showSolution && solution && (
          <section className="panel solution-panel">
            <div className="results-header">
              <h3>Optimal Solution</h3>
              <button className="btn ghost" onClick={() => setShowSolution(false)}>
                Close
              </button>
            </div>
            <p className="approach">{solution.approach}</p>
            <div className="complexity">
              <span>Time: {solution.time}</span>
              <span>Space: {solution.space}</span>
            </div>
            <pre className="solution-code">{solution.code}</pre>
          </section>
        )}
      </main>
    </div>
  );
}
