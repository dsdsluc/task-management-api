const md5 = require("md5");
const User = require("../model/user.model");
const ForgotPassword = require("../model/forgot-password.model")
const generateHelper = require("../../../helper/generate");
const helperSendMail = require("../../../helper/sendMail");

module.exports.register = async(req, res)=>{
    
    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
        email: req.body.email
    })

    if(existEmail){
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        })
    }
    else{
        const user = new User(req.body);
        await user.save();
        res.cookie("token",user.token)

        res.json({
            code: 200,
            message: "Đăng kí thành công!",
            token: user.token
        })
    }
    
}

module.exports.login = async(req, res)=>{
    
    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
        email: req.body.email
    })

    if(!existEmail){
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        });
        return;
    };
    const user = await User.findOne({
        email: req.body.email
    });
    if(user.deleted == true){
        res.json({
            code: 400,
            message: "Tài khoản đã bị khóa!"
        });
        return;
    }
    if(user.password == req.body.password){
        const token = user.token;

        res.cookie("token",token)

        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token: token
        });
    }
    
}

module.exports.forgotPassword = async(req, res)=>{
    const email = req.body.email

    const user = await User.findOne({
        email: email
    })

    if(!user){
        res.json({
            code: 400,
            message: "Email không tồn tại!",
        });
        return 
    }

    //Luu vao database

    const otp = generateHelper.generateRandomNumber(6);

    const timeExpire = 5
    const objectOtp = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire*60*1000
    }
    
    const forgotPassword = new ForgotPassword(objectOtp);
    await forgotPassword.save();

    // Gui ma OTP vao email
    const subject = "Mã OTP để lấy lại mật khẩu"
    const html = `
        Mã OTP của bạn là : <b>${otp}<b/>.Lưu ý mã chỉ có hiệu lực trong 5 phút
    `

    helperSendMail.sendMail(email,subject,html);
    res.json({
        code: 200,
        message: "Đã gửi otp"
    })
}

module.exports.otpPassword = async(req, res)=>{
    const {otp, email} = req.body;

    const checkOtp = ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if(!checkOtp){
        res.json({
            code: "400",
            message: "otp khong dung"
        });
        return 
    };

    const user = await User.findOne({
        email: email
    })

    const token = user.token;

    res.cookie("token",token);

    res.json({
        code: "200",
        message: "Nhap OTP thanh cong",
        token: token
    })
}

module.exports.resetPassword = async(req, res)=>{
    const token = req.cookies.token ;
    const password = md5(req.body.password);

    const user = await User.findOne({
        token: token
    })
    if(!user){
        res.json({
            code: 400,
            message: "Nguoi dung khong ton tai"
        })
        return
    }
    
    await User.updateOne({
        _id: user.id
    },{
        password: password
    })

    res.json({
        code: 200,
        message: " Cap nhat thanh cong"
    })
}

module.exports.detail = async(req, res)=>{
    res.json({
        code: 200,
        message: "Thành công!",
        infor: req.user
    });

}