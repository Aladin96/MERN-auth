const {User} = require("../model/User");
const ROLES = require("../permission/rolesEnum");

// Register User
exports.register = async (req, res, next) =>{

    const { username, password, role } = req.body;
    
    // * Check if all fields are fill
    if(!username || !password || !role)
        return res.status(400).json({message: "Please fill all fields"});

    // * Check if role exists in roles
  
    if(!Object.values(ROLES).includes(role)) 
        return res.status(400).json({message: "Somthing wrong happend try again"});

    // * Check if username exist already
    const user = await User.findOne({username});
    if(user)
        return res.status(400).json({message: "User already exists !"});

    // * Create new user    
    let newUser = new User({username, password, role});
   try{

    await newUser.save();
     res.status(200).json({message: "User created with success"});

   }catch(err){
    return res.status(400).json({message: "Somthing wrong happend try again"});
   }     
              
}

// Login 
exports.login = async (req, res, next) =>{

    const {username, password} = req.body;

    // * Check if all fields are fill
    if(!username || !password )
        return res.status(400).json({message: "Please fill all fields"});

    // * Check if Credentials are valid
    try{
        const user = await User.findOne({username}).select("+password");
        const isPasswordMatch = await user.isPasswordMatch(password.toString());

        if(!user || !isPasswordMatch)
        return res.status(404).json({message: "Invalid Credentials"})

        sendToken(user, res); 
        
    }catch(err){
        console.log(err)
        return res.status(404).json({message: "Invalid Credentials", err})
    } 
       
}

// Functions

const sendToken = async (user, res) => {

 const token = user.getSignedToken();
 res.status(200).json({token});

}
