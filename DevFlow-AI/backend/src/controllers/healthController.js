import pool from "../config/db.js";

export const getHealth = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_status");

    res.status(200).json({
      success: true,
      message: "DevFlow AI backend is running",
      database: rows[0]?.db_status === 1 ? "connected" : "unknown",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "DevFlow AI backend is running",
      database: "disconnected",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};
