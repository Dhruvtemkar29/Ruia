const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const util = require("util");
const multer = require("multer");
const app = express();
const port = 3100;
const connection = require("D:\\Dev\\hack-ruia\\backend\\SQLdb.js");
const awaitquery = util.promisify(connection.query).bind(connection);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors());

const storage = multer.diskStorage({
    destination:"d:\\Dev",
    filename:async function(req, file, callback) {
        let temp = await find_in_blog();
        num = temp.length + 1;
        const filename = `file_${num}.jpg`;
        callback(null,filename)
    }
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1048576
    }
})

const find_in_user = async()=>{
    let rows = [];
    rows = await awaitquery("SELECT * from ruia.user");
    if(rows.length == 0){
        return "Data not found";
    } else {
        return rows;
    }
}

const find_in_blog = async()=>{
    let rows = [];
    rows = await awaitquery("SELECT * from ruia.blog");
    if(rows.length == 0){
        return "Data not found";
    } else {
        return rows;
    }
}

const find_in_blog_id = async()=>{
    let rows = [];
    rows = await awaitquery(`SELECT * from ruia.blog where blog_id = '${id}';`);
    if(rows.length == 0){
        return "Data not found";
    } else {
        return rows;
    }
}

const add_user = async(id,name,email,password)=>{
    let rows = [];
    rows = await awaitquery(`INSERT INTO ruia.user(user_id, name, email, password) VALUES (${id}, "${name}", "${email}", "${password}");`);
}

const add_blog = async(id,title,description,views, comments, image, time)=>{
    let rows = [];
    rows = await awaitquery(`INSERT INTO ruia.blog(blog_id, blog_title, blog_description, blog_views, blog_comments, blog_image, blog_time) VALUES (${id}, "${title}", "${description}", ${views}, ${comments}, '${image}', '${time}');`);
}

const validate_user = async(email,password)=>{
    let rows=[];
    rows = await awaitquery(`SELECT * FROM ruia.user where email = '${email}';`)
    if (rows.length == 0) {
        return false;
    } else if (rows[0].password == password) {
        return true;
    } else {
        return rows;
    }
}

app.get("/getBlogData",async(req,resp)=>{
    let data = await find_in_blog();
    resp.send(data);
})

app.get("/getBlogDataUsingId",async(req,resp)=>{
    let data = await find_in_blog_id();
    resp.send(data);
})

app.get("/addBlog",async(req,resp)=>{
    let month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let temp = await find_in_blog();
    let id = temp.length + 1;
    let d = new Date();
    let blog_time = d.getDate()+" "+month[d.getMonth()] + " " + d.getFullYear();
    let view = Math.floor(Math.random()*(1000+1));
    let comments = Math.floor(Math.random()*(view-0+1));
    let data = await add_blog(id, req.body.title, req.body.description, view, comments, `/files/file_${id}.jpg`, blog_time);
    resp.send(data);
})

app.get("/addUser",async(req,resp)=>{
    let temp = await find_in_user();
    let id = temp.length + 1;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let data = await add_user(id,name,email,password);
})

app.get("/validateUser",async(req,resp)=>{
    let email = req.body.email;
    let password = req.body.password;
    let data = await validate_user(email,password);
    resp.send(data);
})

app.listen(port,()=>{
    console.log(`Server running at : http://localhost:${port}/`)
})