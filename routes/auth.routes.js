const express = require("express");
const { Router } = express;
const passport = require("passport");

const authRouter = Router();

authRouter.get("/login", (req, res) => {
    try {
        if (req.isAuthenticated()) {
            console.log("User is already logged");
            res.render("index", { layout: "login" });
        } else {
            console.log("User can login");
            res.render("index", { layout: "login" });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});

authRouter.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/api/chat-products",
        failureRedirect: "/login",
    }),
    (req, res) => {
        console.log(res)
    }
);

authRouter.post(
    "/logout",
    (req, res) => {
        try {
            req.logout((err) => {
                if (error) return next(err);
                res.redirect("/login");
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
            });
        }
    }
);

authRouter.get("/signup", (req, res) => {
    res.render("index", { layout: "signup" });
});

authRouter.post("/signup", passport.authenticate("signup", {
    successRedirect: "/login",
    failureRedirect: "/signup",
}), (req, res) => {
    console.log("yes")
})

module.exports = authRouter;
