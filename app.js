const express=require("express")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")
const ejs=require("ejs")

const app=express();

app.use(bodyparser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const wikiSchema={
    "title": String,
    "content": String
}

const wiki=mongoose.model("Article",wikiSchema);

app.route("/articles")
.get(function(req,res){
    wiki.find({},function(err,body){
        if(err){
            res.send(err);
        }
        else{
            res.send(body);
        }
    })
})
.post(function(req,res){
    let new_article=new wiki({
        title:req.body.title,
        content:req.body.content
    });
    new_article.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.sendStatus(200);
        }
    });
})
.delete(function(req,res){
    wiki.deleteMany({},function(err){
        if(err){
            res.send(err);
        }
        else{
            res.sendStatus(200);
        }
    });
});

app.route("/articles/:query_name")
.get(function(req,res){
     wiki.findOne({title: req.params.query_name},function(err,body){
         if(err){
             res.send(err);
         }
         else{
            res.send(body);
         }
     })
})
.put(function(req,res){
    wiki.updateOne({"title": req.params.query_name},
    {"title":req.body.title, "content":req.body.content},
    function(err){
        if(err){
            res.send(err);
        }
        else{
            res.sendStatus(200);
        }
    });
})
.patch(function(req,res){
    wiki.updateOne({"title":req.params.query_name},
    {$set:req.body},
    function(err){
        if(err){
            res.send(err);
        }
        else{
            res.sendStatus(200);
        }
    })
})
.delete(function(req,res){
    wiki.deleteOne({"title":req.params.query_name},function(err){
        if(err){
            res.send(err);
        }
        else{
            res.sendStatus(200);
        }
    });
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started");
});