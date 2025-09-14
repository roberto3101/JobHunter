// asistente.js - Versión Inteligente con detección de plataforma

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function rellenarFormulario(datos) {
    const { url, datosPersonales } = datos;
    console.log(`🤖 Asistente iniciado. Navegando a la URL de Google Jobs: ${url}`);
    
    const browser = await puppeteer.launch({ headless: false, executablePath: chromePath });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        // 1. Hacemos clic en el botón "Aplicar" de Google para ir al sitio real
        console.log("Haciendo clic en el botón 'Aplicar' para ir al sitio de la empresa...");
        // El botón para aplicar suele ser un <a> dentro de un <span>. Este selector busca los más comunes.
        const applyButtonSelector = 'a.n1d52b, a.whGJna';
        await page.waitForSelector(applyButtonSelector, { timeout: 10000 });
        
        // Abrimos el enlace en una nueva pestaña para tener más control
        const finalUrl = await page.$eval(applyButtonSelector, el => el.href);
        const newPage = await browser.newPage();
        await newPage.goto(finalUrl, { waitUntil: 'networkidle2' });
        console.log(`Navegando a la página de postulación final: ${finalUrl}`);
        
        // Cerramos la pestaña de Google Jobs que ya no necesitamos
        await page.close(); 
        
        // 2. Detectamos qué tipo de página es y aplicamos la lógica correcta
        if (finalUrl.includes('greenhouse.io')) {
            console.log('✅ Plataforma detectada: Greenhouse. Rellenando formulario...');
            await rellenarGreenhouse(newPage, datosPersonales);
        } else if (finalUrl.includes('lever.co')) {
            console.log('⚠️ Plataforma detectada: Lever. Aún no implementada.');
            // Aquí iría la función para rellenar Lever: await rellenarLever(newPage, datosPersonales);
        } else {
            console.log('⚠️ Plataforma no reconocida. El autocompletado no se ejecutará.');
        }

        console.log('🚀 ¡Formulario listo! Revisa los datos y haz clic en Enviar.');

    } catch (error) {
        console.error(`❌ Error en el asistente: ${error.message}`);
        console.log("El navegador quedará abierto para que puedas intentarlo manualmente.");
    }
}

// Lógica específica para formularios de GREENHOUSE
async function rellenarGreenhouse(page, datos) {
    // Rellenar campos de texto
    await page.type('#first_name', datos.nombre.split(' ')[0], { delay: 50 }); // Solo el primer nombre
    await page.type('#last_name', datos.nombre.split(' ').slice(1).join(' '), { delay: 50 }); // El resto como apellido
    await page.type('#email', datos.email, { delay: 50 });
    await page.type('#phone', datos.telefono, { delay: 50 });

    // Subir el currículum
    const cvPath = path.join(__dirname, 'tu_cv', 'mi_cv.pdf');
    const inputUpload = await page.$('input#resume');
    if(inputUpload) {
        await inputUpload.uploadFile(cvPath);
        console.log('📄 CV subido a Greenhouse.');
    }
}

// Aquí podrías añadir más funciones como `rellenarLever`, `rellenarWorkday`, etc.

module.exports = rellenarFormulario;