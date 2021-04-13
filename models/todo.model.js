const mongoose = require ('mongoose')

const todoSchema = new mongoose.Schema({        //create todo schema
    title :{
        type : String ,
        required : true
    },
    isCompleted :{
        type : Boolean,
        required :true
    },
    User :{
        id :{
            type :String,
            required : true
        },
        name : {
            type : String,
            required : true
        }
    },
    createdAt :{
        type :Date,
        default : Date.now
    }
})


const Todo = mongoose.model('TODOs', todoSchema)         // create new collection

module.exports = {Todo}