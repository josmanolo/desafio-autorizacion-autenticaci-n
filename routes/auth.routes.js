const express = require("express");
const { Router } = express;
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = Router();

authRouter.get("/login", (req, res) => {
    try {
        if (req.isAuthenticated()) {
            console.log("User is already logged");
            res.render("index", { layout: "login" });
        } else {
            console.log("User can login");
            res.render("login");
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
        try {
            const { userLogin } = req.body;
            req.session.username = userLogin;
            return res.status(200).redirect("/api/chat-products");
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
            });
        }
    }
);

authRouter.post("/logout", authMiddleware, (req, res) => {
    try {
        req.logout((err) => {
            if (error) return next(err);
            res.redirect('/login');
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});

module.exports = authRouter;
