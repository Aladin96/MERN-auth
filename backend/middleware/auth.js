const {verify} = require("jsonwebtoken");
const {User} = require("../model/User");

exports.requireAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }


    if(!token)
        return res.status(403).json({message: "Forbidden"});

    try{
        const decode = verify(token, process.env.JWT_SECRET);
   
        const user = await User.findById(decode.id);

        if(!user)
            return res.status(404).json({message: "No user Found"});
       
        // * set Current user in req.user
        req.user = user;
        next();    
    }catch(err){
        return res.status(401).json({message: "unathorized page"});
    }
}