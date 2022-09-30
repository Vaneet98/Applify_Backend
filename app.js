require("dotenv").config();
const http=require("http");
const express = require("express");
var cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
 
const swaggerUI = require("swagger-ui-express");
const swaggerJsDocs = require("./swagger.json");
//For chat
console.log("vaneet")
const users=[{}];
const server=http.createServer(app);
const io=socketIO(server); 
io.on("connection",(socket)=>{
  console.log("New Connection");

  socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
  })

  socket.on('message',({message,id})=>{
      io.emit('sendMessage',{user:users[id],message,id});
  })

  socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
      console.log(`user left`);
  })
});
app.use("/swagger-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use("/Images",express.static("Images"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require("./config/connectionDB").connect();
require("./config/connectionDB").syn();
const router = require("./routes/AdminRoutes");
const routers= require("./routes/NotificatoinRoutes")
const feedback= require("./routes/feedbackRoutes")
const category= require("./routes/categoryRoutes")
const FAQ= require("./routes/FAQRoutes");
const AppVersion=require("./routes/AppVersionRouter")
const AdminAchivement=require("./routes/AdminAchivementRoutes")
const AchivmentLink=require("./routes/AchivementsecondRoutes")
const ReprotedBy=require("./routes/ReportedContentRouter")
const ReportBug=require("./routes/ReportBugRouter");
const userRoutes = require("./routes/userRoutes");
//Due to this table is create at database but not use it not table create
require("./model/index.js");
app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});
// For Social Login
const passport = require("passport");
require("./controller/userController").registrationByFacebook();
require("./controller/userController").registrationByGoogle();
const session = require("express-session"); /*Session - when user LoggedIn */

// Middleware FOR SOCAIL LOGIN
app.use(
  session({
    resave: false,
    saveUninitialized: true.valueOf,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/admin", router);
app.use("/notification",routers)
app.use("/feedback",feedback)
app.use("/category",category)
app.use("/FAQ",FAQ)
app.use("/app",AppVersion)
app.use("/Achivement",AdminAchivement)
app.use("/Achivementlink",AchivmentLink)
app.use("/ReprotedContent",ReprotedBy)
app.use("/RepotedBug",ReportBug)
app.use("/api", userRoutes);


app.listen(process.env.PORT, () => { 
  console.log(`http://localhost:${process.env.PORT}`);
});
