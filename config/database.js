const mongoose = require('mongoose');

module.exports.connect = async ()=>{
    try {
        const mongooseUrl = process.env.MONGOOSE_URL
        await mongoose.connect(mongooseUrl);
        console.log("Connect Success!")
    } catch (error) {
        console.log("Connect Error!")
    }
}