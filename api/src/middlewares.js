import jwt from 'jsonwebtoken';

// export const authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET);
//     req.user = decoded; // Attach user data to the request object
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }
// };

export function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
export function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
export function catchAsync(theFunction) {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
}



