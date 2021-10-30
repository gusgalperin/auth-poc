import jwt from 'jsonwebtoken'
import {SECRET} from '../config.js'

async function checkJwt(token){
    try{
        const decoded = await jwt.verify(token, SECRET);
        return decoded;
    }
    catch(err){
        throw new Error(`invalid token: ${err.message}`)
    }
}

function createJwt(data){
    return jwt.sign(data, SECRET, { expiresIn: "1h"})
}

export { checkJwt, createJwt }