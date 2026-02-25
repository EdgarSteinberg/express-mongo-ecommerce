


export const handlePolicies = (policies) => {
  return (req, res, next) => {

    if (!req.user) { return res.status(401).json({ message: "Usuario no autenticado" }); }

    if (policies.includes(req.user.role)) { return next(); }

    return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
  };
};
