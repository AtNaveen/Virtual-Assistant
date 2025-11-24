const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    assistantImage:{
        type: String,
    },
     assistantName:{
        type: String,
    },
    history : [
        {
        type: Object,
    }
]
}, {
    timestamps: true,
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
