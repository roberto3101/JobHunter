const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const buscarOfertas = require('./buscador.js');
const rellenarFormulario = require('./asistente.js');

let browser;

async function iniciarNavegador() {
    try {
        console.log("🤖 Lanzando navegador único para la sesión...");
        const userDataDir = path.join(__dirname, 'bot_profile');
        browser = await puppeteer.launch({
            headless: false,
            userDataDir: userDataDir,
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
    await iniciarNavegador();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', async () => {
    if (browser) {
        await browser.close();
    }
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('iniciar-busqueda', async (event, datosBusqueda) => {
    const { palabrasClave, pais } = datosBusqueda;
    const ofertas = await buscarOfertas(palabrasClave, pais);
    return ofertas;
});

ipcMain.handle('iniciar-asistente', async (event, datosPostulacion) => {
    if (!browser) {
        dialog.showErrorBox('Navegador no disponible', 'El navegador no se inició correctamente. Por favor, reinicia la aplicación.');
        return { success: false };
    }
    try {
        await rellenarFormulario(browser, datosPostulacion);
        return { success: true };
    } catch (error) {
        console.error('Error en el asistente de postulación:', error);
        return { success: false };
    }
});