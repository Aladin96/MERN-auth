const {Post} = require("../model/Post");
const {User} = require("../model/User");

const {isAdmin, isSubAdmin} = require("../permission/role");

// * Browse posts ( Browse by all [guest, admin, sub_admin, user] )

exports.browsePosts = async (req, res, next) => {
 
    try{
        const posts = await Post.find({});

        res.status(200).json({posts});
    }catch(err){
        res.status(404).json({message: "No posts Found"});
    }
}

// * Add new Post ( create only by [admin, sub_admin, user] )

exports.addPost = async (req, res, next) => {

    const { title, text } = req.body;
    const id_user = req.user._id

    if(!title || !text)
        return res.status(400).json({message: "Please fill all fields"});
     
    let post = new Post({title, text, user: id_user});
   try{

       //Save post
        post = await post.save();
        
        // Save post on the user created by
        const userById = await User.findById(id_user);
        userById.posts.push(post);
        userById.save();

        res.status(200).json({message: "Post created with success", post});
   }catch(err){
       res.status(400).json({message: "something wrong happend try again"});
   }     

}

// * Edit post only by [ admin , sub_admin ] && the user posted the post
exports.editPost = async (req, res, next)=>{

    const {title, text} = req.body;
    const idPost = req.params.id

    if(!title || !text)
        return res.status(400).json({message: "Please fill all fields"});
    
    // Update post
    try{
        // Check post if exists
        const post = await Post.findOne({_id: idPost});;
        
        // * Only Admin OR sub_admin OR the user has posted this post can edit it
        if(isAdmin(req.user) || isSubAdmin(req.user) || req.user._id.toString() == post.user.toString() ){
            // update changes
            post.title = title;
            post.text = text;
            await post.save();

            return res.status(200).json({message: "Post updated with success", post});
        }else{
            return res.status(403).json({message: "You dont have permission to edit this post"});  
        }
             
    }catch(err){
        return res.status(404).json({message: "No post Found"});
    }
}

// * Delete post only by [admin]

exports.deletePost = async (req, res, next) => {
    const id_post = req.params.id;
          
    try{
        const post = await Post.findById({_id: id_post});
        await post.deleteOne();

        // Delete post from User
        const user = await User.findOne({_id: post.user})
        user.deletePost(id_post)
        await user.save();

        return res.status(404).json({message: "Post Deleted"});
    }catch(err){
        return res.status(404).json({message: "No post Found"});
    }
}
