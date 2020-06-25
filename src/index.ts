import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import * as path from "path";
import ContactController = require("./controllers/ContactController");
// eslint-disable-next-line import/no-unresolved
import { Contact } from "./shared/ContactInterface";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../src/index.html"));
};

// Helpers

// This function return all contacts from the database and send an event to render
// the process with the response.
function indexDatabase(event: IpcMainEvent): void {
  ContactController.index().then((res) => {
    event.reply("indexDatabaseLoaded", res);
  });
}

// Events

// When the window loads get all database contacts and send them to render process
ipcMain.on("mainWindowLoaded", function (event: IpcMainEvent) {
  indexDatabase(event);
});

// Create a contact register on the database
ipcMain.on("submitInfo", function (event, args) {
  ContactController.create(args as Contact).then((res) => {
    if (res) {
      indexDatabase(event);
    } else {
      console.log({ Error: "Contact not added" });
    }
  });
});

// Deletes the contact register on the database
ipcMain.on("deleteContact", function (event, args) {
  ContactController.delete(Number(args)).then((res) => {
    if (res[0] !== -1) {
      indexDatabase(event);
    } else {
      console.log({ Error: "The register does not exist" });
    }
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
