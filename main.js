const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "src/img/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "src/js/preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  win.loadFile("src/ui/login.html");
};
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
