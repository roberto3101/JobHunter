// main.js - Versión estable

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const buscarOfertas = require('./buscador.js');
const rellenarFormulario = require('./asistente.js');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.loadFile('index.html');
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

ipcMain.handle('iniciar-busqueda', async (event, datosBusqueda) => {
    const { palabrasClave, pais } = datosBusqueda;
    try {
        const ofertas = await buscarOfertas(palabrasClave, pais);
        return ofertas;
    } catch (error) {
        console.error('Error en el proceso de búsqueda:', error);
        dialog.showErrorBox('Error de Búsqueda', 'No se pudieron obtener las ofertas.');
        return [];
    }
});

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