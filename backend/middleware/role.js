exports.requireRole = (roles) => {
 return (req, res, next) =>{

    const user = req.user;
    // Check permission 
    if(!roles.includes(user.role)){
        return res.status(403).json({message: "You dont have permission for that"});
    }

    next();
 }
    
}
