// buscador.js
const puppeteer = require('puppeteer');

async function buscarOfertas(palabrasClave) {
    console.log(`Iniciando búsqueda con las palabras: ${palabrasClave}`);
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    // Hacemos que nuestra visita parezca más humana
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const url = `https://www.getonbrd.com/jobs/search?q=${encodeURIComponent(palabrasClave)}`;
        // Cambiamos a 'networkidle2' para esperar a que las peticiones de red se calmen.
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log('Página cargada. Esperando que aparezcan los resultados...');

        // *** CAMBIO CLAVE 1: Espera explícita ***
        // Esperamos a que el primer 'job card' sea visible en la página.
        // Si después de 20 segundos no aparece, lanzará un error.
        await page.waitForSelector('.gb-results-list .gb-job-card', { timeout: 20000 });

        console.log('Resultados encontrados. Extrayendo ofertas...');

        const ofertas = await page.evaluate(() => {
            const resultados = [];
            const items = document.querySelectorAll('.gb-results-list .gb-job-card');

            items.forEach(item => {
                const tituloEl = item.querySelector('h2 > a');
                // *** CAMBIO CLAVE 2: Selector de empresa actualizado ***
                const empresaEl = item.querySelector('.gb-company-name a'); // El selector anterior era menos preciso.

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

        console.log(`✅ ¡Se encontraron ${ofertas.length} ofertas!`);
        return ofertas;

    } catch (error) {
        console.error(`❌ Error durante la búsqueda: ${error.message}`);
        console.log("Es posible que la página haya tardado mucho en responder o que no haya resultados para tu búsqueda.");
        return []; // Devolvemos un array vacío en caso de error
    } finally {
        await browser.close(); // Cerramos el navegador en cualquier caso
    }
}

module.exports = buscarOfertas;