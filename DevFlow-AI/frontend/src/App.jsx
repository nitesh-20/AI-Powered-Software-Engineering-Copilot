import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

const githubRepoPattern =
  /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/i;

function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repositoryData, setRepositoryData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setRepositoryData(null);
    setAnalysisData(null);

    const trimmedUrl = inputUrl.trim();

    if (!githubRepoPattern.test(trimmedUrl)) {
      setRepositoryUrl(trimmedUrl);
      setError("Enter a valid GitHub repository URL.");
      return;
    }

    setRepositoryUrl(trimmedUrl);
    setLoading(true);

    try {
      const { data } = await api.post("/repositories/analyze", {
        githubUrl: trimmedUrl
      });

      setRepositoryData(data.repository || null);
      setAnalysisData(data.aiAnalysis || null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to analyze repository."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Repository Intake</p>
        <h1>DevFlow AI</h1>
        <p className="subtitle">
          Paste a GitHub repository URL to fetch GitHub metadata and generate a
          Gemini-powered project analysis.
        </p>

        <form className="repo-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="repositoryUrl">
            GitHub Repository URL
          </label>
          <input
            id="repositoryUrl"
            name="repositoryUrl"
            type="url"
            className="repo-input"
            placeholder="https://github.com/owner/repository"
            value={inputUrl}
            onChange={(event) => setInputUrl(event.target.value)}
          />
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Repository"}
          </button>
        </form>

        <div className="status-panel">
          <h2>Analysis Status</h2>
          {repositoryUrl && (
            <p>
              <strong>URL in state:</strong> {repositoryUrl}
            </p>
          )}
          {error && <p className="status-error">{error}</p>}
          {repositoryData && (
            <div className="status-success result-grid">
              <p>
                <strong>Name:</strong> {repositoryData.name}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {repositoryData.description || "No description available"}
              </p>
              <p>
                <strong>Language:</strong> {repositoryData.language || "Unknown"}
              </p>
              <p>
                <strong>Stars:</strong> {repositoryData.stars}
              </p>
              <p>
                <strong>Forks:</strong> {repositoryData.forks}
              </p>
            </div>
          )}
          {analysisData && (
            <div className="analysis-card">
              <h3>Gemini Analysis</h3>
              {"error" in analysisData ? (
                <p className="status-error">{analysisData.error}</p>
              ) : (
                <>
                  <p>
                    <strong>Project Summary:</strong>{" "}
                    {analysisData.projectSummary}
                  </p>
                  <div>
                    <strong>Technology Stack:</strong>
                    <div className="chip-row">
                      {analysisData.technologyStack?.length ? (
                        analysisData.technologyStack.map((item) => (
                          <span className="chip" key={item}>
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="chip">Not identified</span>
                      )}
                    </div>
                  </div>
                  <p>
                    <strong>Architecture:</strong>{" "}
                    {analysisData.architectureExplanation}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
