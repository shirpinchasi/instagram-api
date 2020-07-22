const User = require("../models/user");
const md5 = require("md5");
const config = require("../config/env/index");
const Post = require("../models/post");
const posts = require("./posts");
const DURATION_60D =  60 * 60 * 24 * 60 * 1000;


class Users{

    async getAll(req ,res) {
        const regex = new RegExp(".*" + req.query.username + ".*");
        try{
            const users = await User
                .find({username : regex})
                .select(["username", "bio"])
                .limit(10)
            res.json(users)
        }catch(err){
            res.status(500).json(err)
        }
    
    }
    async getUser(req,res) {
        try {
            const user = await User
            .findById(req.params.id)
            .select("username","bio", "avatar", "createdAt")
            if (!user) {
                res.sendStatus(404);
                return;
            }
            res.json(user);
        }catch(err) {
            res.status(500).json(err);
        }
    }

    async check(req, res) {
		const { username, email } = req.query;

		if (!username && !email) {
			res.sendStatus(400);
			return;
		}
		let property = email ? 'email' : 'username';

		try {
			const isExist = await User.exists({
				[property]: req.query[property]
			});
			res.json(isExist);
		} catch(err) {
			res.status(400).json(err);
		}
	}




    async create(req, res) {
        const newUser = new User(req.body);
        newUser.password = md5(newUser.password)
        try{
            const createdUser = await newUser.save();
            res.status(201).json(createdUser);
        } catch(err) {
            if (err.code === 11000) {
                res.sendStatus(409);
                return;
              }
              res.sendStatus(500);
        }
    }
    async login (req, res) {
        const credentials= req.body;
        try{
            const user = await User.findOne({
                username: credentials.username,
                password: md5(credentials.password)
            });
            if(!user) {
                res.sendStatus(401)
            return;
            }
            res.cookie(config.cookieName, user._id, {maxAge : DURATION_60D})
            res.json(user).sendStatus(200);
        }catch(err){
            res.sendStatus(500)
        }
    }

    me(req, res) {
        res.json(req.user);
    }

    async getPosts(req, res) {
		try {
			const posts = await Post
				.find({
                    user: req.params.id
                })
                .populate("user", [ "avatar", 'username'])
                .sort({createdAt : req.query.sort || 1});
                res.json(posts);
        }catch(err){
            res.sendStatus(400);
        }
	}
}

module.exports = new Users();