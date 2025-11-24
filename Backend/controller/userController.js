const userModel = require('../models/userModel.js');
const { uploadOnCloudinary } = require('../config/cloudinary.js');
const { response } = require('express');
const { geminiResponse } = require('../gemini.js');
const moment = require('moment');

exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }   
       return  res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(504).json({ msg: error.message });
    }       
}

exports.updateAssistant = async (req, res) => {
    try {
        const {assistantName,imageUrl} = req.body;
        let assistantImage;

        if(req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);   
        }else {
            assistantImage = imageUrl;
        }   
       const user = await userModel.findByIdAndUpdate(req.userId,{
            assistantName, assistantImage}
            ,{new:true}).select('-password');
       
            return res.status(200).json(user)
    }
    catch (error) {
        console.log(error);
        res.status(504).json({ msg: error.message });
    }  
}

exports.askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await userModel.findById(req.userId);
    user.history.push(command);
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "sorry, i can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    const cleanInput = gemResult.userInput || gemResult.userinput || command;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: cleanInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get-time":
        return res.json({
          type,
          userInput: cleanInput,
          response: `Current time is ${moment().format("HH:mm:ss")}`,
        });

      case "get-day":
        return res.json({
          type,
          userInput: cleanInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput: cleanInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: cleanInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({ response: "sorry, i can't understand" });
    }
  } catch (error) {
    console.log(error);
    res.status(504).json({ msg: error.message });
  }
};
