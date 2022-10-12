const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const isValidPassword = (userBDPassword, password) => {
    console.log("Bcrypt helper: " + password)
    return bcrypt.compareSync(password, userBDPassword);
};

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

const connectDB = async () => {
    try {
        const url =
            "mongodb+srv://jomalolep:Arush1429@cluster0.tus6ylk.mongodb.net/test";
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
};

module.exports = { isValidPassword, checkAuth, connectDB, createHash };