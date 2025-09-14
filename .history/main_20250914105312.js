// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const buscarOfertas = require('./buscador.js');
const rellenarFormulario = require('./asistente.js');

// Función para crear la ventana principal de la aplicación
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'icono.png') // Opcional: añade un ícono
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); // Descomenta para abrir las herramientas de desarrollador
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- Comunicación con la Interfaz ---

// Escucha la petición de búsqueda desde la interfaz
ipcMain.handle('iniciar-busqueda', async (event, palabrasClave) => {
  try {
    const ofertas = await buscarOfertas(palabrasClave);
    return ofertas;
  } catch (error) {
    console.error('Error en el proceso de búsqueda:', error);
    dialog.showErrorBox('Error de Búsqueda', 'No se pudieron obtener las ofertas. Revisa la consola para más detalles.');
    return [];
  }
});

// Escucha la petición para autocompletar un formulario
ipcMain.handle('iniciar-asistente', async (event, datosPostulacion) => {
  try {
    await rellenarFormulario(datosPostulacion);
    return { success: true };
  } catch (error) {
    console.error('Error en el asistente de postulación:', error);
    dialog.showErrorBox('Error del Asistente', `No se pudo completar el formulario. Detalles: ${error.message}`);
    return { success: false };
  }
});