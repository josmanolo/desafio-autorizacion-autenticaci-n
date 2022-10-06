const express = require("express");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const fakerRandomProducts = require("./mockData");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const messagesContainer = require("./containers/containerMongo.js");
const authRouter = require("./routes/session.routes");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const authMiddleware = require("./middleware/auth.middleware");

const Messages = new messagesContainer();

const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());
app.use(
    session({
        secret: "12345",
        resave: true,
        saveUnitialized: true,
        store: MongoStore.create({
            mongoUrl:"mongodb+srv://jomalolep:Arush1429@cluster0.tus6ylk.mongodb.net/?retryWrites=true&w=majority",
            mongoOptions: mongoConfig,
        }),
    })
);

//console.log([productsList, messagesList])

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index",
        layoutsDir: __dirname + "/views",
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
app.use(authRouter);

app.get("/api/chat-products", authMiddleware, async (req, res) => {
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

io.on("connection", (socket) => {
    socket.on("new-message", (msg) => {
        Messages.saveMessage(msg);

        const getDBMessages = async () => {
            const messages = await Messages.getMessages();
            socket.emit("new-message-server", messages);
        };

        getDBMessages();
    });
});

const port = 9000;
httpServer.listen(port, () => {
    console.log(`Server running port ${port}`);
});
