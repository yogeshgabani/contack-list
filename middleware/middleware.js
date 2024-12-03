const jwt = require('jsonwebtoken');
const jwtKey = 'userlogin';
const {User} = require("../model/user");


const authMiddleware = async (req, res, next) => {
    const userData = jwt.verify(req.headers.authorization, jwtKey);
    console.log('userData -->>', userData);
    req.userId = userData._id;
    next();
  }

const RoleMiddleware = async (req, res, next) => {
  const data = req.userId;
  console.log("user id", data)
  const roledata = await User.findOne({_id: data})
  console.log('user----> data', roledata)
  if (roledata.role === 'admin') {
    next()
  }
  else {
    res.status(500).json({ message: 'you are not admin to view all data' });
  }
}


  module.exports = { authMiddleware, RoleMiddleware }