var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_apps",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	content: String,
	zone: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);



app.get("/", function(req, res){
	res.redirect("/blog");	
});



app.get("/blog", function(req, res){
	Blog.find({},function(err, findBlog){
		if(err){
			console.log("Something Went Gone Wrong.......");
		}
		else{
			res.render("index.ejs", {findBlog: findBlog});
		}
	});

});

app.get("/blog/new", function(req, res){
	
	res.render("new.ejs");
});

app.post("/blog", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new.ejs");
		}
		else{
			res.redirect("/blog");
		}
	});
});


app.get("/blog/:id", function(req, res){
	Blog.findById(req.params.id, function(err, blogFound){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("show.ejs", {blog: blogFound})
		}
	});
});


app.get("/blog/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, blogFound){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("edit.ejs", {blog: blogFound})
		}
	});
});

app.put("/blog/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,  function(err, blogFound){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.redirect("/blog/" + req.params.id);
		}
	});	
});

app.delete("/blog/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id,  function(err){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.redirect("/blog");
		}
	});	
})

app.listen(process.env.PORT||3000, process.env.IP, function(){
	console.log("Server has Started......");
});

