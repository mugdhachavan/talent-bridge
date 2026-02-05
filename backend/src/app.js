const express = require("express");
const app = express();
const homeRoutes = require("./routes/home.routes");
const publicRoutes = require("./routes/public.routes");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/home", homeRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/users", userRoutes);


module.exports = app;
