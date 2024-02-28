const taskRouter = require("./task.router");
const userRouter = require("./user.router");
const authMiddlerware = require("../middleware/auth.middleware");


module.exports = (app)=>{
    const version = "/api/v1"

    app.use(version + "/task",authMiddlerware.requireAuth,taskRouter);

    app.use(version + "/user",userRouter);
}