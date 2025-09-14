// buscador.js
const puppeteer = require('puppeteer');

async function buscarOfertas(palabrasClave) {
    console.log(`Iniciando búsqueda con las palabras: ${palabrasClave}`);
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        // *** CAMBIO CLAVE Y DEFINITIVO: La estructura de la URL cambió en el sitio web. ***
        const url = `https://www.getonbrd.com/jobs/programacion/q/${encodeURIComponent(palabrasClave)}`;
        
        console.log(`Navegando a la nueva URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log('Página cargada. Esperando que aparezcan los resultados...');

        // Verificamos si la página nos devolvió un error 404
        const esPagina404 = await page.evaluate(() => document.title.includes('404'));
        if (esPagina404) {
            console.error('❌ La búsqueda resultó en una página 404. Puede que no haya resultados para esas palabras clave.');
            return [];
        }

        await page.waitForSelector('.gb-results-list .gb-job-card', { timeout: 20000 });

        console.log('Resultados encontrados. Extrayendo ofertas...');

        const ofertas = await page.evaluate(() => {
            const resultados = [];
            const items = document.querySelectorAll('.gb-results-list .gb-job-card');

            items.forEach(item => {
                const tituloEl = item.querySelector('h2 > a');
                const empresaEl = item.querySelector('.gb-company-name a');

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
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = buscarOfertas;