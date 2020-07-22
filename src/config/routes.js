const express = require("express");
const users = require("../controllers/users");
const posts = require("../controllers/posts");
const auth = require("../middlewares/auth");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/posts')
	},
	filename: function (req, file, cb) {
        const nameArr = file.originalname.split(".");
        const extantion = nameArr[nameArr.length -1];
        let filename = Math.random().toString(36).substring(2, 9);
        cb(null,filename + "." + extantion);
    }
    
})
const upload = multer({ storage: storage });
const routes = express.Router();


routes.get("/users",users.getAll);
routes.put("/users",users.create);
routes.get('/users/check', users.check);
routes.post("/users/login",users.login);
routes.get('/users/me',auth, users.me);
routes.get("/users/:id",auth,users.getUser);


routes.get("/posts",auth, posts.getAll);
routes.get("/users/:id/posts",auth,posts.getAll);
routes.post('/posts/:id/likes', auth, posts.like);
routes.delete('/posts/:id/likes/:userId', auth, posts.unlike);
routes.put("/posts",upload.single("image"),auth , posts.create);
routes.get("/posts/:id",auth,posts.getAll);
routes.get("/posts/:id",auth,posts.get);



routes.get("/health", (req, res) =>{
    res.send()
})


module.exports = routes;