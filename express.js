const express = require("express");
const app = express();
const path = require("node:path");
const port = 3000;

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/src", express.static(path.join(__dirname, "src")));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/ui/login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/ui/register.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/ui/dashboard.html"));
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//:userId
