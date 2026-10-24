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
    const fields = Object.keys(err.keyPattern || {}).join(', ');
    return res.status(409).json({ message: `Duplicate entry exists for ${fields || 'field'}. Please use a unique title or name.` });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message).join(', ');
    return res.status(400).json({ message: messages || 'Validation failed' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid record identifier' });
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error('Server Error:', err);
  }
  res.status(status).json({
    message: status === 500 ? 'Something went wrong' : err.message
  });
};
