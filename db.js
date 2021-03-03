const {Schema,Model} = require('mongoose');
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();


// Connect to the in-memory database.
module.exports.connect = async () => {
    const uri = await mongod.getUri(true);
    const mongooseOpts = {
        useNewUrlParser: true,
         useUnifiedTopology: true 
    };
    await mongoose.connect(uri, mongooseOpts).then(() => { console.log("connection established with mongodb server"); })
}

//schema 
const userSchema = new Schema({
    username:String,
    password:String
})
//model
exports.userModel= mongoose.model("user",userSchema);