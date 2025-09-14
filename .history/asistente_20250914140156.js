// asistente.js - VERSIÓN FINAL simplificada (solo abre pestañas)

const path = require('path');

// La función ahora recibe el navegador como primer argumento
async function rellenarFormulario(browser, datos) {
    const { url, datosPersonales } = datos;
    if (!url || !url.startsWith('http')) {
        console.error(`❌ URL inválida recibida: ${url}. No se puede continuar.`);
        return;
    }
    
    console.log(`🤖 Abriendo nueva pestaña en el navegador existente. Navegando a: ${url}`);
    
    try {
        const page = await browser.newPage(); // ¡Solo creamos una nueva pestaña!
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        if (url.includes('greenhouse.io')) {
            console.log('✅ Plataforma detectada: Greenhouse. Rellenando formulario...');
            await rellenarGreenhouse(page, datosPersonales);
        } else if (url.includes('lever.co')) {
            console.log('⚠️ Plataforma detectada: Lever. Aún no implementada.');
        } else {
            // Mensaje cuando el sitio no es reconocido. ¡Esto es normal!
            // Significa que el bot no tiene instrucciones para ese formulario específico.
            console.log(`⚠️ Plataforma no reconocida (${url}). El autocompletado no se ejecutará.`);
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