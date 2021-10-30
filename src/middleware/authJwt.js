import { checkJwt } from '../security/jwt.js'

async function verifyToken (req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
      res.status(403)
      res.send("No token provided");
      return;
    }

    if(!await checkJwt(token)){
      res.status(401)
      res.send("Unauthorized");
      return
    }

    await next();
};

export { verifyToken }