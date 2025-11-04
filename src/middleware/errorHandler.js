export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};
