require('dotenv').config()
const jwt = require('jsonwebtoken');

const decodedToken = (req, requireAuth = true) => {
  const header =  req.req.headers.authorization;
  if(header){
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  }

  if (requireAuth) {
    throw new Error('Login in to access resource');
  } 

  return null
}

const destroyToken = (req) => {
  const header = req.req.headers.authorization
  if(header){
    const token = header.replace('Bearer', '')
    jwt.destroy(token)
    return {status: true, message: "token has been destroyed"}
  }else{
    return {status: false, message: "No header given try again"}
  }
}
module.exports = { decodedToken, destroyToken }