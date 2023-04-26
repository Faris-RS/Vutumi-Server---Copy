import mongoose from "mongoose";

const connection = ()=>{
    // mongoose.connect('mongodb://0.0.0.0:27017/vutumi')
    mongoose.connect(process.env.DATABASE)
}
mongoose.set('strictQuery', true);

export default connection