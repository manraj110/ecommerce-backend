const jwt = require("jsonwebtoken");

// This function will be our middleware
module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header("x-auth-token");

  // 2. If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 3. If a token is found, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's info from the token to the request object
    req.user = decoded.user;
    next(); // Move on to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
