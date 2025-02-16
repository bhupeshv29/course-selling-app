import jwt from 'jsonwebtoken'
import { JWT_ADMIN_PASSWORD } from '../config.js';


const adminMiddleware = (req,res,next)=>{
    const token  = req.headers.token;
    const decoded = jwt.verify(token ,JWT_ADMIN_PASSWORD);

    if(decoded){
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not signed in"
        })
    }
}
export { adminMiddleware };