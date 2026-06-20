import axios from "axios";
import { analyzeRepository as analyzeRepositoryWithGemini } from "../services/geminiService.js";

const githubRepoPattern =
  /^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/i;

const extractRepositoryDetails = (githubUrl) => {
  const match = githubUrl.trim().match(githubRepoPattern);

  if (!match) {
    return null;
  }

  return {
    owner: match[2],
    repo: match[3]
  };
};

export const submitRepository = async (req, res) => {
  const { repositoryUrl } = req.body;

  if (!repositoryUrl || typeof repositoryUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "Repository URL is required"
    });
  }

  if (!githubRepoPattern.test(repositoryUrl.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid GitHub repository URL"
    });
  }

  return res.status(201).json({
    success: true,
    message: "Repository URL received successfully",
    repositoryUrl: repositoryUrl.trim()
  });
};

export const analyzeRepository = async (req, res) => {
  const { githubUrl } = req.body;

  if (!githubUrl || typeof githubUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "GitHub URL is required"
    });
  }

  const repositoryDetails = extractRepositoryDetails(githubUrl);

  if (!repositoryDetails) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid GitHub repository URL"
    });
  }

  try {
    const headers = {
      Accept: "application/vnd.github+json"
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const { owner, repo } = repositoryDetails;
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    const repositoryMetadata = {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      topics: data.topics || [],
      defaultBranch: data.default_branch,
      visibility: data.visibility,
      homepage: data.homepage
    };

    let aiAnalysis = null;

    try {
      aiAnalysis = await analyzeRepositoryWithGemini(repositoryMetadata);
    } catch (aiError) {
      aiAnalysis = {
        error: aiError.message
      };
    }

    return res.status(200).json({
      success: true,
      repository: repositoryMetadata,
      aiAnalysis
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Repository not found on GitHub"
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: "GitHub API rate limit reached or access forbidden"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze repository"
    });
  }
};
