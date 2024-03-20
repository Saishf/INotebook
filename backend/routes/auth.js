const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');


//create user using: Post {/api/auth}
router.post('/',[
   body('name','Enter a valid name').isLength({min:3}),
   body('email','enter a valid email').isEmail(),
   body('password','enter a valid password').isLength({min:3}),

],(req,res)=>{
   const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array()});
  }

  User.create({
   name: req.body.name,
   password: req.body.password,
   email: req.body.email,

  }).then(user => res.json(user)).catch(err => {console.log(err).res.json({eroor: "please enter unqie value for email"})})

  
})

module.exports = router