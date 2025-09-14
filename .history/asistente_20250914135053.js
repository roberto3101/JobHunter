// asistente.js - VERSIÓN FINAL Y CORREGIDA

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');

// --- ¡ESTA ES LA LÍNEA QUE ESTABA CAUSANDO TODOS LOS ERRORES! ---
// Ahora está corregida con tu nombre de usuario real: "user".
const userDataDir = 'C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\User Data';
// -----------------------------------------------------------------

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function rellenarFormulario(datos) {
    const { url, datosPersonales } = datos;
    if (!url || !url.startsWith('http')) {
        console.error(`❌ URL inválida recibida: ${url}. No se puede continuar.`);
        return;
    }
    
    console.log(`🤖 Asistente iniciado. Navegando DIRECTAMENTE a: ${url}`);
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        executablePath: chromePath,
        userDataDir: userDataDir // Usamos la ruta corregida
    });

    const page = await browser.newPage();
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        if (url.includes('greenhouse.io')) {
            console.log('✅ Plataforma detectada: Greenhouse. Rellenando formulario...');
            await rellenarGreenhouse(page, datosPersonales);
        } else if (url.includes('lever.co')) {
            console.log('⚠️ Plataforma detectada: Lever. Aún no implementada.');
        } else {
            console.log('⚠️ Plataforma no reconocida. El autocompletado no se ejecutará.');
        }

        console.log('🚀 ¡Formulario listo! Revisa los datos y haz clic en Enviar.');

    } catch (error) {
        console.error(`❌ Error en el asistente: ${error.message}`);
        console.log("El navegador quedará abierto para que puedas intentarlo manualmente.");
    }
}

async function rellenarGreenhouse(page, datos) {
    await page.type('#first_name', datos.nombre.split(' ')[0], { delay: 50 });
    await page.type('#last_name', datos.nombre.split(' ').slice(1).join(' '), { delay: 50 });
    await page.type('#email', datos.email, { delay: 50 });
    await page.type('#phone', datos.telefono, { delay: 50 });

    const cvPath = path.join(__dirname, 'tu_cv', 'mi_cv.pdf');
    const inputUpload = await page.$('input#resume');
    if(inputUpload) {
        await inputUpload.uploadFile(cvPath);
        console.log('📄 CV subido a Greenhouse.');
    }
}

module.exports = rellenarFormulario;