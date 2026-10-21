export const wrap = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const httpErr = (status, message) =>
  Object.assign(new Error(message), { status });

export const globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.flatten ? err.flatten().fieldErrors : err.errors
    });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'Upload failed (max 5MB)' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value' });
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error('Server Error:', err);
  }
  res.status(status).json({
    message: status === 500 ? 'Something went wrong' : err.message
  });
};
