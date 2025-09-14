// asistente.js
const puppeteer = require('puppeteer');
const path = require('path');

async function rellenarFormulario(datos) {
    const { url, datosPersonales } = datos;

    console.log(`Iniciando asistente para la URL: ${url}`);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Página de postulación cargada. Rellenando formulario...');

    /*
    ¡¡¡IMPORTANTE!!!
    Esta es la parte que DEBES personalizar. Los selectores de los campos
    (ej: '#first_name', 'input[name="email"]') son diferentes en cada sitio web.
    Usa el inspector de tu navegador (clic derecho -> Inspeccionar) para encontrar
    los selectores correctos para los campos del formulario al que quieres postular.
    */

    // Ejemplo para un formulario hipotético
    try {
        // Rellenar campo de nombre
        await page.type('#nombre_completo', datosPersonales.nombre, { delay: 100 });
        // Rellenar campo de email
        await page.type('#email', datosPersonales.email, { delay: 100 });
        // Rellenar campo de teléfono
        await page.type('#telefono', datosPersonales.telefono, { delay: 100 });
        
        // Simular la subida del CV
        console.log('Buscando el campo para subir el CV...');
        const inputUploadHandle = await page.$('input[type=file]');
        
        // Ruta absoluta a tu CV
        const filePath = path.join(__dirname, 'tu_cv', 'mi_cv.pdf');
        
        await inputUploadHandle.uploadFile(filePath);
        console.log('CV subido exitosamente.');

    } catch (error) {
        console.error(`Error al rellenar un campo: ${error.message}`);
        console.log("El script continuará, pero es posible que el formulario no esté completo. Recuerda adaptar los selectores.");
    }

    console.log('¡Formulario listo! El navegador quedará abierto para que envíes la postulación manualmente.');
    // No cerramos el navegador para que el usuario pueda hacer clic en "Enviar"
    // await browser.close();
}

module.exports = rellenarFormulario;