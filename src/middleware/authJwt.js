import { checkJwt } from '../security/jwt.js'

async function verifyToken (req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.status(403)
        res.send("No token provided");
        return;
    }

    try {
        const event = checkJwt(token)
    } catch (err) {
        res.status(401)
        res.send(err.message);
        return;
    }

    await next();
}

export { verifyToken }