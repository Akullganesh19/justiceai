/* global process */
export const errorHandler = (err, req, res, _next) => {
  console.error('Unhandled error:', err);

  if (err instanceof URIError) {
    return res.status(400).json({ error: 'Malformed URI' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
