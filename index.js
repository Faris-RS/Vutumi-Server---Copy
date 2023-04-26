import cookieSession from "cookie-session";
import express from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passportSetup from "./strategies/passport.js";
import passport from "passport";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// import authRouter from "./routes/auth.js";
import connection from "./config/dbConnection.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import adminRouter from "./routes/admin.js";
import chatRouter from "./routes/chat.js";
import userModel from "./models/userModel.js";

const app = express();
dotenv.config();
connection();

app.use(
  cookieSession({
    name: "session",
    keys: ["openreplay"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(logger("dev"));
app.use(cookieParser());
app.use(fileUpload());

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// app.use(cors({
//   origin: '*',
//   credentials: true,
//   methods: 'GET,POST,PUT,DELETE,PATCH',
//   allowedHeaders: ['Content-type', 'Access', 'Authorization'],
// }));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

// app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/post", postRouter);
app.use("/admin", adminRouter);
app.use("/chat", chatRouter);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// const io = new Server(server, {
//   cors: {
//     // origin: [
//     //   "http://localhost:4000",
//     //   "http://localhost:8080",
//     //   "http://vutumi-react.s3-website.ap-south-1.amazonaws.com",
//     //   "https://roaring-centaur-5c9228.netlify.app",
//     // ],
//     origin: "https://roaring-centaur-5c9228.netlify.app",
//     methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "Authorization",
//     ],
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   // Search
//   socket.on("search", async (query) => {
//     const results = {
//       data: await userModel
//         .find({
//           $or: [
//             { firstName: { $regex: query, $options: "i" } },
//             { lastName: { $regex: query, $options: "i" } },
//           ],
//         })
//         .limit(5),
//     };
//     socket.emit("searchResult", results);
//   });

//   // Chat
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });

//   // Tic Tac Toe
//   socket.on("joinRoom", (roomCode) => {
//     console.log(`A user joined the room ${roomCode}`);
//     socket.join(roomCode);
//   });

//   socket.on("play", ({ id, roomCode }) => {
//     console.log(`play at ${id} to ${roomCode}`);
//     socket.broadcast.to(roomCode).emit("updateGame", id);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected");
//   });

//   let waitingRoom = null;
//   socket.on("joinWaitingRoom", () => {
//     console.log(waitingRoom);
//     if (waitingRoom === null) {
//       // Create a new waiting room
//       waitingRoom = uuidv4();
//       socket.join(waitingRoom);
//       console.log(`user ${socket.id} joined waiting room ${waitingRoom}`);
//     } else {
//       // Join the existing waiting room
//       socket.join(waitingRoom);
//       console.log(`user ${socket.id} joined waiting room ${waitingRoom}`);

//       // Notify the first user that the second user joined
//       io.to(waitingRoom).emit("startGame");
//       waitingRoom = null; // Reset waiting room
//     }
//   });
// });
