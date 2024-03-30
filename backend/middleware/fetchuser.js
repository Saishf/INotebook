var jwt = require('jsonwebtoken');
const JWT_TOKEN = 'Tokenforthewebapp$inotebook';
fetchuser = (req,res,next)=>{
//get user from jwt token and append id
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please authincate using valid token"})
    }
   try {
    const data = jwt.verify(token,JWT_TOKEN);
    req.user = data.user
    next();
   } catch (error) {
    res.status(401).send({error:"please authincate using valid token"})
   }
}

module.exports = fetchuser;