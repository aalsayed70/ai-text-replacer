const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const API_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2-flash:generateContent';

app.disableHardwareAcceleration();

let mainWindow;
let appWindowId = null;
let focusedWindowIds = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 100,
    frame: false,
    transparent: true,
    resizable: false,
    roundedCorners: true,
    alwaysOnTop: true,
    useContentSize: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(true);

  if (process.platform === 'linux') {
    mainWindow.setBackgroundColor('#00000000');
    exec('xprop -f _KDE_NET_WM_BLUR_BEHIND_REGION 32c -set _KDE_NET_WM_BLUR_BEHIND_REGION 0 -id ' + mainWindow.getNativeWindowHandle().readUInt32LE(0));
  }

  const handleHex = mainWindow.getNativeWindowHandle().toString('hex');
  appWindowId = parseInt(handleHex, 16).toString();
  console.log("App window id:", appWindowId);

  ipcMain.handle('minimize-window', () => {});

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function monitorActiveWindow() {
  exec('xdotool getactivewindow', (error, stdout, stderr) => {
    if (error) {
      console.error('Error fetching active window:', error);
      return;
    }
    const currentActiveWindowId = stdout.trim();
    if (focusedWindowIds[focusedWindowIds.length - 1] !== currentActiveWindowId) {
      focusedWindowIds.push(currentActiveWindowId);
      console.log('Focused window list updated:', focusedWindowIds);
    }
  });
}

ipcMain.handle('get-selected-text', () => {
  return clipboard.readText('selection');
});

ipcMain.handle('set-clipboard', (event, text) => {
  clipboard.writeText(text);
});

ipcMain.handle('focus-previous-window', () => {
  return Promise.resolve();
});

ipcMain.handle('simulate-paste', () => {
  return new Promise((resolve, reject) => {
    exec('xdotool getactivewindow', (error, stdout, stderr) => {
      if (error) {
        console.error('Error getting current window id:', error);
        return reject(error);
      }
      const currentWindowId = stdout.trim();
      console.log('Current window id:', currentWindowId);

      let targetWindowId = null;
      for (let i = focusedWindowIds.length - 1; i >= 0; i--) {
        if (focusedWindowIds[i] !== currentWindowId) {
          targetWindowId = focusedWindowIds[i];
          console.log("Target window for pasting:", targetWindowId);
          break;
        }
      }
      if (!targetWindowId) {
        console.error("No previous non-app window found");
        return reject("No previous non-app window found");
      }
      console.log("Target window for pasting:", targetWindowId);
      
      exec(`xdotool windowactivate ${targetWindowId}`, (error, stdout, stderr) => {
        if (error) {
          console.error("Error activating target window:", error);
          return reject(error);
        }
        console.log("Activated target window:", targetWindowId);
        const script = `
          sleep 0.1
          xdotool key ctrl+v
        `;
        exec(script, { shell: '/bin/bash' }, (err) => {
          if (err) {
            console.error("Error pasting:", err);
            return reject(err);
          }
          console.log("Paste executed in window:", targetWindowId);
          resolve();
        });
      });
    });
  });
});

ipcMain.handle('process-text', async (event, prompt) => {
  console.log('Received prompt:', prompt);
  let result;
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    result = data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    result = 'Error processing your request';
  }
  
  let targetWindowId = null;
  for (let i = focusedWindowIds.length - 1; i >= 0; i--) {
    if (focusedWindowIds[i] !== appWindowId) {
      targetWindowId = focusedWindowIds[i];
      break;
    }
  }
  if (targetWindowId) {
    exec(`xdotool windowactivate ${targetWindowId}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error activating target window after processing:', error);
      } else {
        console.log('Activated target window after processing:', targetWindowId);
      }
    });
  } else {
    console.warn("No previous non-app window found after processing");
  }
  
  return result;
});

app.on('ready', () => {
  createWindow();
  setInterval(monitorActiveWindow, 500);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
