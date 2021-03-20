const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    role: {
        type: String,
        required: true // There are 3 roles [ admin, sub_admin, user ]
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
         }
    ]
});

// * Hashing password
userSchema.pre("save", async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    
    // Hash password
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }catch(err){
        console.log(err)
    }
    
    next();

})

// * Compare Password When loged in
userSchema.methods.isPasswordMatch = async function(password){

    const isMatch = await bcrypt.compare(password, this.password);

    return isMatch;
}

// * Create Token with JWT 

userSchema.methods.getSignedToken = function(){

    const payload = {id: this._id, username: this.username, role: this.role}
    const secret = process.env.JWT_SECRET;
    const expiressIn = process.env.JWT_EXPIRE;

    return sign(payload, secret, {expiresIn: process.env.JWT_EXPIRE}); // ! Check expireIn
}

userSchema.methods.deletePost = async function(id){
    return await this.posts.pull({_id: id}) 
}
const User = mongoose.model("User", userSchema);

exports.User = User;