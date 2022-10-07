const express = require("express");
const { Router } = express;
const authMiddleware = require("../middleware/auth.middleware");
const fakerRandomProducts = require("./mockData");

const appRouter = router();

appRouter.get("/api/chat-products", authMiddleware, async (req, res) => {
    try {
        const getDBMessages = async () => {
            const messages = await Messages.getMessages();
            console.log(messages);
            res.render("index", {
                layout: "app",
                list: {
                    products: fakerRandomProducts(),
                    messages: messages,
                    username: req.session.username,
                },
            });
        };
        getDBMessages();
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e,
        });
        console.log(e);
    }
});

appRouter.get("/profile", checkAuth, (req, res) => {
    res.render("profile", { layout: "profile" });
});

module.exports = appRouter;