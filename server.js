const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const messagesContainer = require("./containers/containerMongo.js");
const authRouter = require("./routes/auth.routes");

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
app.use(authRouter);
app.use(appRouter);
app.use(
    session({
        secret: "12345",
        rolling: true,
        resave: true,
        saveUnitialized: true,
        // store: MongoStore.create({
        //     mongoUrl:
        //         "mongodb+srv://jomalolep:Arush1429@cluster0.tus6ylk.mongodb.net/?retryWrites=true&w=majority",
        //     mongoOptions: mongoConfig,
        // }),
    })
);

/////////////////////////////////Passport///////////////////////////////////
app.use(passport.initialize());
app.use(passportt.session());

passport.use(
    "login",
    new LocalStrategy((username, password, done) => {
        let user; //TODO: CONSULTAR EN MONGO LOGIN

        if (!user) {
            console.log("User not found");
            return done(null, false, { message: "User not found" });
        }

        if (!isValidPassword(user, password)) {
            console.log("Wrong Password");
            return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user);
    })
);

passport.use(
    "signup",
    new LocalStrategy(
        { passReqToCallback: true },
        (req, username, password, done) => {
            let user; //TODO: CONSULTAR EN MONGO SIGNUP
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

passport.deserializeUser((id, done) => {
    let user; //TODO: CONSULTAR  MONGO
    done(null, user);
});

//////////////////////////////////////////////////////////////////////////////////

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
