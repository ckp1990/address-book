const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true, // Should be true for security
      allowRunningInsecureContent: false,
    },
    autoHideMenuBar: true,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for File I/O
const userDataPath = app.getPath('userData');
const contactsFile = path.join(userDataPath, 'contacts.json');

/**
 * Validates a single contact object.
 */
function isValidContact(contact) {
  if (!contact || typeof contact !== 'object') return false;

  const stringFields = {
    id: 100,
    name: 200,
    phone: 50,
    address: 1000,
    city: 200,
    state: 200,
    country: 200,
    pincode: 50,
    created_at: 100
  };

  // Check required fields and types/lengths
  // 'name' is required in the form, but let's be strict.
  if (typeof contact.name !== 'string' || contact.name.trim() === '') return false;

  for (const [field, maxLength] of Object.entries(stringFields)) {
    const value = contact[field];
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string' || value.length > maxLength) {
        return false;
      }
    }
  }

  // Ensure no unexpected large fields or too many fields
  const allowedFields = Object.keys(stringFields);
  const actualFields = Object.keys(contact);
  if (actualFields.length > allowedFields.length + 5) return false; // allow some extra metadata but not too much

  return true;
}

/**
 * Validates an array of contacts.
 */
function isValidData(data) {
  if (!Array.isArray(data)) return false;

  // Max 5000 contacts to prevent huge file writes
  if (data.length > 5000) return false;

  for (const contact of data) {
    if (!isValidContact(contact)) return false;
  }

  return true;
}

ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(contactsFile)) {
      const data = fs.readFileSync(contactsFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Failed to load contacts:', error);
    return [];
  }
});

ipcMain.handle('save-data', async (event, data) => {
  try {
    if (!isValidData(data)) {
      console.error('Security Warning: Invalid data format received in save-data');
      return false;
    }
    fs.writeFileSync(contactsFile, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Failed to save contacts:', error);
    return false;
  }
});
