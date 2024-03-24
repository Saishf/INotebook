const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_TOKEN = 'Tokenforthewebapp$inotebook';

//create user using: Post {/api/auth/createuser}
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    //check whether the user exixts already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      // .then(user => res.json(user)).catch(err => {console.log(err).res.json({eroor: "please enter unqie value for email"})})
      const data = {
        user:{
          id : user.id
          
        }
      }

      const authtoken = jwt.sign(data,JWT_TOKEN);

      res.json({authtoken});
      // res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some Error has ocuured");
    }
  }
);

//authneticate user using: Post {/api/auth/createuser}
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password").exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const {email,password} = req.body;

    try{
      let user = await User.findOne({email})
      if(!user){
        return res.status(400).json({error: "input correct crediantials"})
      }

      const comparepassword = await bcrypt.compare(password,user.password)

      if(!comparepassword){
        return res.status(400).json({error: "input correct crediantials"})
      }

      const data = {
        user:{
          id : user.id
        }
      }

      const authtoken = jwt.sign(data,JWT_TOKEN);

      res.json({authtoken});
    }
    catch (error) {
      console.log(error.message);
      res.status(500).send("internal server Error");
    }

  })

module.exports = router;
