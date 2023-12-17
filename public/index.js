/* eslint-disable */
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
} = require('electron');
const path = require('path');
const fs = require('fs');
const { readIniFileSync } = require('read-ini-file');
const rtfToHTML = require('@iarna/rtf-to-html');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/* if (require('electron-squirrel-startup')) {
  app.quit();
} */

try {
    require('electron-reloader')(module);
} catch (_) {}

const settingsPath = process.env.NODE_ENV !== 'production' ? '../settings.json' : './settings.json';
const activatedModFile = process.env.NODE_ENV !== 'production' ? '../activatedMods.json' : './activatedMods.json';


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'none.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenu(null);
  
  mainWindow.loadURL(process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });

  if (result && result.filePaths && result.filePaths.length > 0) {
    return result.filePaths[0];
  }

  return null;
});


ipcMain.handle('save-settings', async (event, settings) => {
  const filePath = path.resolve(process.cwd(), settingsPath);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(settings), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle('load-settings', async () => {
  const filePath = path.resolve(process.cwd(), settingsPath);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        resolve(null);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  });
});

ipcMain.handle('load-mod-list', async (event, modPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(modPath, (err, files) => {
      if (err) {
        reject([]);
      } else {
        const result = [];
        files.forEach(file => {
          const filePath = path.resolve(modPath, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            let name = file;
            let image = '';
            let description = '';
            let common = [];
            let compiled = [];

            if (fs.existsSync(path.resolve(filePath, 'ModName.ini'))) {
              const modName = readIniFileSync(path.resolve(filePath, 'ModName.ini'));
              name = (modName && modName.Name && modName.Name.Caption) || file;
            }

            if (fs.existsSync(path.resolve(filePath, 'example.jpg'))) {
              const imageFile = fs.readFileSync(path.resolve(filePath, 'example.jpg'))
              image = imageFile.toString('base64');
            }

            if (fs.existsSync(path.resolve(filePath, 'readme.rtf'))) {
              const data = fs.readFileSync(path.resolve(filePath, 'readme.rtf'));
              description = (data && data.toString()) || '';
            }

            if (fs.existsSync(path.resolve(filePath, 'common'))) {
              common = fs.readdirSync(path.resolve(filePath, 'common'));
            }

            if (fs.existsSync(path.resolve(filePath, 'compiled'))) {
              compiled = fs.readdirSync(path.resolve(filePath, 'compiled'));
            }


            result.push({
              name,
              image,
              description,
              path: filePath,
              common,
              compiled,
            });
          }
        });
        resolve(result);
      }
    });
  });
});

ipcMain.handle('convert-rtf', async (event, rtf) => {
  return new Promise((resolve, reject) => {
    rtfToHTML.fromString(rtf, (err, html) => {
      if (err) {
        reject('');
      } else {
        resolve(html);
      }
    });
  });
});

ipcMain.handle('deactivate-all-mods', async (event, risenPath) => {
  return new Promise((resolve, reject) => {
    const dataFolder = path.resolve(risenPath, '../data');

    const fileRegex = /[\w\d]+\.p\d{2}/;
    const commonFiles = fs.readdirSync(path.resolve(dataFolder, './common'));
    const compiledFiles = fs.readdirSync(path.resolve(dataFolder, './compiled'));

    commonFiles.forEach(file => {
      if (fileRegex.test(file)) {
        fs.unlinkSync(path.resolve(dataFolder, './common', file));
      }
    });
    compiledFiles.forEach(file => {
      if (fileRegex.test(file)) {
        fs.unlinkSync(path.resolve(dataFolder, './compiled', file));
      }
    });

    resolve();
  });
});

ipcMain.handle('activate-mods', async (event, risenPath, links) => {
  return new Promise((resolve, reject) => {
    const dataFolder = path.resolve(risenPath, '../data');

    links.forEach(link => {
      const existingPath = path.resolve(link.modPath, link.targetFolder, link.source);
      const linkPath = path.resolve(dataFolder, link.targetFolder, link.target);
      fs.linkSync(existingPath, linkPath);
    });

    resolve();
  });
});


ipcMain.handle('save-activated-mods', async (event, activatedMods) => {
  const filePath = path.resolve(process.cwd(), activatedModFile);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(activatedMods), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle('load-activated-mods', async () => {
  const filePath = path.resolve(process.cwd(), activatedModFile);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        resolve(null);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  });
});

/* eslint-enable */