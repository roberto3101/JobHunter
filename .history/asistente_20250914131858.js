// asistente.js - Versión final simplificada

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function rellenarFormulario(datos) {
    const { url, datosPersonales } = datos; // 'url' ahora es el enlace DIRECTO
    
    // Si la URL no es válida por alguna razón, no continuamos.
    if (!url || !url.startsWith('http')) {
        console.error(`❌ URL inválida recibida: ${url}. No se puede continuar.`);
        return;
    }
    
    console.log(`🤖 Asistente iniciado. Navegando DIRECTAMENTE a: ${url}`);
    const browser = await puppeteer.launch({ headless: false, executablePath: chromePath });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // --- LÓGICA SIMPLIFICADA ---
        // Ya no pasamos por Google. Detectamos y rellenamos directamente.
        if (url.includes('greenhouse.io')) {
            console.log('✅ Plataforma detectada: Greenhouse. Rellenando formulario...');
            await rellenarGreenhouse(page, datosPersonales);
        } else if (url.includes('lever.co')) {
            console.log('⚠️ Plataforma detectada: Lever. Aún no implementada.');
            // Aquí iría la función para rellenar Lever.
        } else {
            console.log('⚠️ Plataforma no reconocida. El autocompletado no se ejecutará.');
        }

        console.log('🚀 ¡Formulario listo! Revisa los datos y haz clic en Enviar.');

    } catch (error) {
        console.error(`❌ Error en el asistente: ${error.message}`);
        console.log("El navegador quedará abierto para que puedas intentarlo manualmente.");
    }
}

// Lógica específica para formularios de GREENHOUSE (sin cambios)
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