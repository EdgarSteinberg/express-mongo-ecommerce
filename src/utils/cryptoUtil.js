import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const comparePassword = (user, password) => {
  if (!user) { // mensaje error
    console.log('❌ Usuario no encontrado');
    return false;
  }

  if (!user.password) { // mensaje error
    console.log('❌ El usuario no tiene password');
    return false;
  }

  return bcrypt.compareSync(password, user.password);
};


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


export const handlePolicies = (policies) => {
  return (req, res, next) => {

    if (!req.user) { return res.status(401).json({ message: "Usuario no autenticado" }); }

    if (policies.includes(req.user.role)) { return next(); }

    return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
  };
};
