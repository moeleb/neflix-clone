import jwt from "jsonwebtoken"
import { ENV_VARS } from "../config/envVars.js"


const generateTokenAndSetCookie = (userId,res)=> {
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn : '15d'})
    res.cookie("jwt-netflix", token, {
        maxAge : 15 * 24 * 3600 * 1000,
        httpOnly : true,
        sameSite : 'strict',
        secure : ENV_VARS.NODE_DEV !=="development"

    })
return token ;
}

export default generateTokenAndSetCookie