

import jwt from "jsonwebtoken"; 

export const verifyToken = (req, res, next) => {
  // 1. Token desde headers (Bearer token)
  const headerToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : undefined;

  // 2. Token desde cookies
  const cookieToken = req.cookies?.auth;

  // 3. Token desde query
  const queryToken = req.query.access_token;

  // 4. Tomamos el primero que exista
  const receivedToken = headerToken || cookieToken || queryToken;

  if (!receivedToken) {
    return res.status(401).json({ message: "Token no encontrado" });
  }

  // 5. Verificamos el token
  jwt.verify(receivedToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    // 6. Usuario autenticado
    req.user = payload;
    next();
  });
};
