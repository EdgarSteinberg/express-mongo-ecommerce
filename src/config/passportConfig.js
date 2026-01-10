/* import passport from "passport";
import jwt, { ExtractJwt } from 'passport-jwt';

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: "coderSecret"
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.coderCookieToken ?? null; // coderCookieToken clave de la cookie
    }
    return token;
}

export default initializePassport; */


import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";

// Estrategia JWT de passport-jwt
const JWTStrategy = jwt.Strategy;

/**
 * Extrae el token JWT desde las cookies de la request.
 * Passport va a usar esta función para obtener el token
 * en cada request protegida.
 */
const cookieExtractor = (req) => {
    // Si no existe la request o no hay cookies, no hay token
    if (!req?.cookies) return null;

    // Devuelve el token guardado en la cookie llamada auth
    return req.cookies.auth ?? null;
};

/**
 * Inicializa la estrategia JWT de Passport.
 * Se ejecuta una sola vez al levantar la app.
 */
const initializePassport = () => {
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                // Indica de dónde se extrae el JWT (cookies)
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

                // Clave secreta para validar la firma del token
                secretOrKey: "coderSecret"
            },
            /**
             * Callback que se ejecuta si el token es válido.
             * El payload decodificado queda disponible como req.user
             */
            async (jwt_payload, done) => {
                try {
                    // Si por algún motivo no hay payload, se rechaza
                    if (!jwt_payload) return done(null, false);

                    // Autenticación exitosa
                    return done(null, jwt_payload);
                } catch (error) {
                    // Error interno en la validación
                    return done(error, false);
                }
            }
        )
    );
};

export default initializePassport;
