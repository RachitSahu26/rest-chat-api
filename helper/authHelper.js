const bcrypt = require("bcrypt");

const hashpassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        throw new Error("Error hashing password");
    }
};

const comparePassword = async (password, hashedPassword) => {
    try {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Error comparing passwords");
    }
};

module.exports = { hashpassword, comparePassword };
