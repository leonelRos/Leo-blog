const mongoose = require('mongoose');

//create schema
const postSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "Title is required"],
        trim : true,
        maxLength: [200, "Title cannot be more than 200 characters"],
    },
    dates :{
        type: Date,
        required: [true, "Date is required"],
        trim : true,
    },
    notes: {
        type: String,
        required: [true, "Notes is required"],
        trim : true,
    },

},{
    timestamps: true,
})

module.exports =  mongoose.model("Post", postSchema);