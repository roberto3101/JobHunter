// buscador.js
const puppeteer = require('puppeteer');

async function buscarOfertas(palabrasClave) {
    console.log(`Iniciando búsqueda con las palabras: ${palabrasClave}`);
    // Lanzamos el navegador. 'headless: false' nos permite ver lo que hace.
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    // Construimos la URL de búsqueda
    const url = `https://www.getonbrd.com/jobs/search?q=${encodeURIComponent(palabrasClave)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    console.log('Página cargada. Extrayendo ofertas...');

    // Usamos page.evaluate para ejecutar código en el contexto de la página
    const ofertas = await page.evaluate(() => {
        const resultados = [];
        // Seleccionamos todos los 'cards' de ofertas de trabajo
        const items = document.querySelectorAll('.gb-results-list .gb-job-card');

        items.forEach(item => {
            const tituloEl = item.querySelector('h2 > a');
            const empresaEl = item.querySelector('.gb-company-name-location a');
            
            if (tituloEl && empresaEl) {
                resultados.push({
                    titulo: tituloEl.innerText.trim(),
                    empresa: empresaEl.innerText.trim(),
                    url: tituloEl.href,
                    descripcion: 'Haz clic en "Autocompletar" para ver los detalles y postular.'
                });
            }
        });
        return resultados;
    });

    console.log(`Se encontraron ${ofertas.length} ofertas.`);
    await browser.close(); // Cerramos el navegador
    return ofertas;
}

// Exportamos la función para que main.js pueda usarla
module.exports = buscarOfertas;