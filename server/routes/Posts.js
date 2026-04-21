const express = require("express")
const router = express.Router();
const Post = require("../model/Post");

//sort posts in order newest to last
router.get("/", async (req,res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        res.status(500).json({error: "error to fetch posts"})
    }
});

//Get single POST by ID
router.get("/:id", async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({error: "post not found"});
        res.json(post)
    } catch (err) {
        res.status(500).json({error: "Failed to fetch Posts"})
    }
})

// Create a new post
router.post("/", async (req,res)=>{
    try{
        const {title, dates, notes} = req.body;
        const post = new Post({title, dates, notes});
        const saved = await post.save();
        res.status(201).json(saved)
    } catch (err) {
        if(err.name === "ValidationError"){
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({error: messages.join(", ")});
        }
        res.status(500).json({error: "Failed to create Post"})
    }

})

// PUT uopdate a new post
router.put("/:id", async(req,res)=>{
    try {
        const {title, dates, notes} = req.body;
        const updated = await Post.findByIdAndUpdate(
            req.params.id,
            {title,dates, notes},
            {returnDocument: "after", runValidators: true}
        );
        if(!updated) return res.status(404).json({error: "Post not found"});
        res.json(updated);
    } catch (err) {
           if(err.name === "ValidationError"){
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({error: messages.join(", ")});
        }
        res.status(500).json({error: "Failed to update Post"})
    }

})

//Delete a post
router.delete("/:id", async (req,res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({error: "Post not found"});
        res.json({message: "Post deleted succesfully"});
    } catch (err){
        res.status(500).json({error: "Failed to delete post"})
    }
});

module.exports = router;