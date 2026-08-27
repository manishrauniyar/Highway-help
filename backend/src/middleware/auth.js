import { verifyToken } from "../utils/token.js";
import { ApiError } from "../utils/ApiError.js";

// requireAuth() accepts any authenticated role.
// requireAuth(['mechanic']) restricts to specific role(s).
export function requireAuth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }
    const token = header.replace("Bearer ", "");
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }
    if (roles.length && !roles.includes(decoded.role)) {
      throw new ApiError(403, "You do not have access to this resource");
    }
    req.user = decoded; // { id, role }
    next();
  };
}
