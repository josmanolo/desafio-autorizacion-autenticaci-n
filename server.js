const express = require("express");
const session = require("express-session");
const handlebars = require("express-handlebars");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const messagesContainer = require("./containers/containerMongo.js");
const authRouter = require("./routes/auth.routes");
const Users = require("./models/users.model");

const { isValidPassword, checkAuth } = require("./utils/helpers.js");
const appRouter = require("./routes/app.routes.js");

const Messages = new messagesContainer();
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index",
        layoutsDir: __dirname + "/views",
    })
);

app.use(
    session({
        secret: "12345",
        rolling: true,
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

/////////////////////////////////Passport///////////////////////////////////

passport.use(
    "login",
    new LocalStrategy( async (username, password, done) => {
        try {
            const user = await Users.find({ username });

            if (!user) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }

            if (!isValidPassword(user, password)) {
                console.log("Wrong Password");
                return done(null, false, { message: "Wrong Password" });
            }
            return done(null, user);

        } catch (error) {
            console.log(error);
        }
    })
);

passport.use(
    "signup",
    new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
            const user = await Users.find({ username });
            const { name, email } = req.body;

            if (user) {
                console.log("User already exist");
                return done(null, false, { message: "User already exist" });
            }

            const newUser = {
                username,
                password,
                name,
                email,
            };
            //TODO: GUARDAR EN MONGO
            return donde;
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const user = await Users.find({ username });
    done(null, user);
});

//////////////////////////////////////////////////////////////////////////////////
app.use(authRouter);
app.use(appRouter);

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

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
