const express = require("express");
const {signUp , Login , LogOut} = require("../controller/auth.js");
const {isAuth} = require("../middleware/isAuth.js");

const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/signin', Login);
userRouter.get('/logout', LogOut);


module.exports = userRouter;