const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register: (req, res) => {
        User.create(req.body)
            .then(user => {
                const userToken = jwt.sign({id: user._id}, process.env.SECRET_KEY);
                res 
                    .cookie("usertoken", userToken, {httpOnly:true})
                    .json({msg: "Success!", user: user});
            })
            .catch(err=>console.log(err));
    },
    logout: (req, res) => {
        res.clearCookie("usertoken");
        res.sendStatus(200);
    },
    login: async(req, res) => {
        const user = await User.findOne({email: req.body.email});
        if(user === null) {
            return res.sendStatus(400);
        }
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if(!correctPassword){
            return res.sendStatus(400);
        }
        const userToken = jwt.sign({id: user._id}, process.env.SECRET_KEY);
        res
            .cookie("usertoken", userToken, {
                httpOnly: true
            })
            .json({msg: "Success!"});
    },
    getAll: (req, res) => {
        User.find({})
            .then(users => res.json(users))
            .catch(err => console.log(err))
    }
}