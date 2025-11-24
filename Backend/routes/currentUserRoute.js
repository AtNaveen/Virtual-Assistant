const express = require("express");
const { getCurrentUser ,updateAssistant, askToAssistant } = require("../controller/userController.js");
const { isAuth } = require("../middleware/isAuth.js");
const {upload} = require("../middleware/multer.js")

const currentUserRoute = express.Router();

currentUserRoute.get('/current', isAuth, getCurrentUser);
currentUserRoute.post('/update', isAuth,upload.single("assistantImage") ,updateAssistant);
currentUserRoute.post('/asktoassistant', isAuth, askToAssistant);

module.exports = currentUserRoute;
