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
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const trimmedUrl = inputUrl.trim();

    if (!githubRepoPattern.test(trimmedUrl)) {
      setRepositoryUrl(trimmedUrl);
      setSubmittedUrl("");
      setError("Enter a valid GitHub repository URL.");
      return;
    }

    setRepositoryUrl(trimmedUrl);
    setLoading(true);

    try {
      const { data } = await api.post("/repositories", {
        repositoryUrl: trimmedUrl
      });

      setSubmittedUrl(data.repositoryUrl);
      setSuccessMessage(data.message);
    } catch (err) {
      setSubmittedUrl("");
      setError(
        err.response?.data?.message || "Unable to submit repository URL."
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
          Paste a GitHub repository URL and send it to the backend API.
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
            {loading ? "Submitting..." : "Submit Repository"}
          </button>
        </form>

        <div className="status-panel">
          <h2>Submission Status</h2>
          {repositoryUrl && (
            <p>
              <strong>URL in state:</strong> {repositoryUrl}
            </p>
          )}
          {error && <p className="status-error">{error}</p>}
          {successMessage && (
            <div className="status-success">
              <p>
                <strong>Message:</strong> {successMessage}
              </p>
              <p>
                <strong>Submitted URL:</strong> {submittedUrl}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
