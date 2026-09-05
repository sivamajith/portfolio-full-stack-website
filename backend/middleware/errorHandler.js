function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  const status = error.name === 'ValidationError' ? 400 : error.status || 500;
  console.error(error);
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Something went wrong on the server' : error.message,
  });
}

module.exports = { notFound, errorHandler };
