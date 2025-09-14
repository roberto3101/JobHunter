// main.js - VERSIÓN FINAL con manejo de navegador persistente

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const buscarOfertas = require('./buscador.js');
const rellenarFormulario = require('./asistente.js');

let browser; // Variable para guardar nuestro navegador único

// Función para iniciar Puppeteer
async function iniciarNavegador() {
    try {
        console.log("🤖 Lanzando navegador único para la sesión...");
        const userDataDir = path.join(__dirname, 'bot_profile'); // Usamos el perfil persistente
        browser = await puppeteer.launch({
            headless: false,
            userDataDir: userDataDir, // Le decimos que use el perfil
            defaultViewport: null
        });
        browser.on('disconnected', () => {
            console.log("Navegador cerrado. Limpiando instancia.");
            browser = null;
        });
    } catch (e) {
        console.error("No se pudo iniciar el navegador:", e);
        dialog.showErrorBox('Error Crítico', 'No se pudo iniciar el navegador de Puppeteer. La aplicación no podrá autocompletar formularios.');
    }
}

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

app.whenReady().then(async () => {
    await iniciarNavegador(); // Iniciamos el navegador junto con la app
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', async () => {
    if (browser) {
        await browser.close(); // Cerramos el navegador al cerrar la app
    }
    if (process.platform !== 'darwin') app.quit();
});

// --- COMUNICACIÓN CON LA INTERFAZ ---

ipcMain.handle('iniciar-busqueda', async (event, palabrasClave) => {
    const ofertas = await buscarOfertas(palabrasClave);
    return ofertas;
});

ipcMain.handle('iniciar-asistente', async (event, datosPostulacion) => {
    if (!browser) {
        dialog.showErrorBox('Navegador no disponible', 'El navegador no se inició correctamente. Por favor, reinicia la aplicación.');
        return { success: false };
    }
    try {
        // En lugar de lanzar un navegador, le pasamos el que ya existe
        await rellenarFormulario(browser, datosPostulacion);
        return { success: true };
    } catch (error) {
        console.error('Error en el asistente de postulación:', error);
        return { success: false };
    }
});