const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "src/img/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "src/js/preload.js"),
    },
  });

  win.loadFile("src/ui/login.html");
};
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
