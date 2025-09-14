// asistente.js

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');

async function rellenarFormulario(datos) {
    const { url, datosPersonales } = datos;
    if (!url || !url.startsWith('http')) {
        console.error(`❌ URL inválida recibida: ${url}. No se puede continuar.`);
        return;
    }
    
    console.log(`🤖 Asistente iniciando con perfil persistente. Navegando a: ${url}`);
    
    let browser;

    try {
        const userDataDir = path.join(__dirname, 'bot_profile');
        browser = await puppeteer.launch({ 
            headless: false,
            userDataDir: userDataDir,
            defaultViewport: null
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        if (url.includes('greenhouse.io')) {
            console.log('✅ Plataforma detectada: Greenhouse. Rellenando formulario...');
            await rellenarGreenhouse(page, datosPersonales);
        } else if (url.includes('lever.co')) {
            console.log('⚠️ Plataforma detectada: Lever. Aún no implementada.');
        } else {
            console.log(`⚠️ Plataforma no reconocida (${url}). El autocompletado no se ejecutará.`);
        }

        console.log('🚀 ¡Formulario listo! Puedes revisar y enviar. El navegador se cerrará automáticamente.');
        // Damos tiempo al usuario para que revise antes de cerrar
        await new Promise(resolve => setTimeout(resolve, 60000)); // Espera 60 segundos

    } catch (error) {
        console.error(`❌ Error en el asistente: ${error.message}`);
        console.log("El navegador quedará abierto para que puedas intentarlo manualmente.");
        return; 
    } finally {
        if (browser) {
            console.log("Cerrando navegador del asistente...");
            await browser.close();
        }
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