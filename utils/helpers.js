const bcrypt = require("bcrypt");

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.passports);
};

const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = { isValidPassword, checkAuth };