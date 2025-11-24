const jwt = require("jsonwebtoken");

exports.isAuth =async(req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({msg:"Unauthorized ,No token found"})
        }
        const decoded =await jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(504).json({msg:error.message})
    }

}
