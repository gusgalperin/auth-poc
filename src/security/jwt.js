import jwt from 'jsonwebtoken'
import {SECRET} from '../config.js'

async function checkJwt(token){
    try{
        const decoded = await jwt.verify(token, SECRET);
        return true;
    }
    catch(err){
        return false;
    }
}

function createJwt(data){
    return jwt.sign(data, SECRET, { expiresIn: "1h"})
}

export { checkJwt, createJwt }