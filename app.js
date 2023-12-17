//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hello there, hope you are fine and doing great in life. This is an online blog journal website. Here you can share you regular information in the form of blogs on internet. Understanding the blog concept is essential to get an insight into blogging. A 'Blog' is an updated version of diary. A blog features diary-type commentary and links to articles on other websites, usually presented as a list of entries in chronological order. A blog can range from personal to political and can focus on one narrow subject or a whole range of subjects. Now you can start writing your blogs by going to the link http://localhost:3000/compose.";

const aboutContent = "Hey, I am the owner of this website, Sharat Chandra Sinha. I am a Computer Science Engineering student. I made this project at the beginning of my second year in college, this project is part of a web development course. This website is made mainly using express.js, css for styling, ejs and mongoose for storing data. This website have five pages which includes home page, about page, contact page, compose page and post page. In compose page, you can publish your blog and then redirected to the home page. In home page, you can see your published blogs but only 100 characters are visible, to see the full blog you can click on the read more link which will direct you to the post page where you see your selected full blog.";

const contactContent = "you can contact us for any queries or suggestions to update this website. You can mail us on. and my contact number is 123456789 . Here are my social media links - linkdin(sharatsinha), instagram(sharatsinha). Thank you for using this website for your blogs!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sharat:Test123@cluster0.momdtds.mongodb.net/blogDB", {useNewUrlParser: true})
    .then(()=> console.log("Database Connected!"))
    .catch((err=> console.log(err)));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find()
    .then(function(posts){
      res.render("home", {startingContent: homeStartingContent, posts: posts});
    })
    .catch(function(err){
      console.log(err);
    });
});



app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", async (req, res)=>{
  try{
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({_id: requestedPostId}).exec();
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }
  catch(err){
    console.log(err);
  }
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
