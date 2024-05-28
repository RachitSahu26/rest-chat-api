
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const { hashpassword, comparePassword } = require("../helper/authHelper");



const registerController = async (req, res) => {


  try {
    const { fullName, email, password, confirmPassword, gender } = req.body;
    if (!fullName || !email || !password || !confirmPassword || !gender) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password do not match" });
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "email already exit try different" });
    }
    const hashedPassword = await hashpassword(password);

    // profilePhoto
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${email}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${email}`;

    await User.create({
        fullName,
        email,
        password: hashedPassword,
        profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
        gender
    });
    return res.status(201).json({
        message: "Account created successfully.",
        success: true
    })
} catch (error) {
    console.log(error);
}

};





// ........................login Controller.....

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    };
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Incorrect email or password",
            success: false
        })
    };
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Incorrect email or password",
            success: false
        })
    };
    const tokenData = {
        userId: user._id
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto
    });

} catch (error) {
    console.log(error);
}
};


 const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { registerController, loginUser,logout };