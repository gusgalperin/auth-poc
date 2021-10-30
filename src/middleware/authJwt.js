import jwt from 'jsonwebtoken'
import {SECRET} from '../config.js'

function verifyToken (req, res, next) {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      
      await next();
    });
};

export { verifyToken }