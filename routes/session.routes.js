const express = require("express");
const { Router } = express;
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = Router();

authRouter.get("/login", async (req, res) => {
    try {
        res.render("index", {layout: "login"});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { userLogin } = req.body;
        req.session.username = userLogin;
        return res.status(200).redirect("/api/chat-products")
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});

authRouter.post("/logout", authMiddleware, async (req, res) => {
    try {
        res.status(200).send(`<h1>Hasta luego ${req.session.username}</h1>`);
        req.session.destroy();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
})

module.exports = authRouter;