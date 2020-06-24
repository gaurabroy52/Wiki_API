//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({  extended: true}));
app.use(express.static("public"));

//TODO
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema = new mongoose.Schema({
  title: {
    type : String,
    required: true
  },
  content: {
    type : String,
    required: true
  }
});

const Article = mongoose.model("Article", articleSchema);

app.get("/articles",function(req, res){
  Article.find({}, function(err, docs1){
    if(!err){
      res.send(docs1);
    }else{
      res.send(err);
    }
  });
});
app.post("/articles", function(req, res){
  var newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully created one new article");
    }else{
      res.send(err);
    }
  });
});
app.delete("/articles", function(req, res){
  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully Deleted all  articles");
    }else{
      res.send(err);
    }
  });
});
////request targeting a specific route
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, docs2){
    if(!err){
      if(docs2){
        res.send(docs2);
      }else{
        res.send("That is not in the article database");
      }
    }
  });
})
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},               //conditions
    {title: req.body.title, content: req.body.content},        //updates
    {overwrite: true},                                        //special for put
    function(err){
      if(!err){
        res.send("Replaced the whole requested article");
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Updated Successfully the requested article");
      }else{
      res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Deleted Successfull one specific atricle");
      }else{
        res.send(err);
      }
    }
  );


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
