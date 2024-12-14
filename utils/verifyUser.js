import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header exists
    if (!authHeader) {
      return next(errorHandler(401, "Unauthorized access. Authorization header missing."));
    }

    // Extract the token from the header (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(errorHandler(401, "Unauthorized access. Token missing."));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Forbidden. Token is invalid or expired."));
      }

      // Attach the user data to the request object
      req.user = user;
      next();
    });
  } catch (error) {
    // Catch unexpected errors
    next(errorHandler(500, "Internal Server Error."));
  }
};
