// buscador.js - Versión final que usa tu Chrome local

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// --- ¡CAMBIO IMPORTANTE AQUÍ! ---
// Esta es la ruta donde normalmente se instala Google Chrome en Windows.
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
//----------------------------------

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Iniciando búsqueda en Google Jobs con: "${palabrasClave}"`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            // --- ¡LÍNEA CLAVE! Le decimos a Puppeteer que use este ejecutable ---
            executablePath: chromePath,
            //---------------------------------------------------------------------
            defaultViewport: null,
            args: ['--start-maximized']
        });

        const page = await browser.newPage();
        const searchTerm = `${palabrasClave} trabajo`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&ibp=htl;jobs`;

        console.log(`Navegando a: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        const jobsContainerSelector = '#search-results';
        console.log('Página cargada. Esperando por el contenedor de trabajos...');
        await page.waitForSelector(jobsContainerSelector, { timeout: 15000 });

        console.log('Contenedor encontrado. Extrayendo ofertas...');
        
        await page.evaluate(async () => {
            const container = document.querySelector('#search-results');
            for (let i = 0; i < 5; i++) {
                container.scrollTop = container.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        });

        const ofertas = await page.evaluate(() => {
            const resultados = [];
            const items = document.querySelectorAll('.iFjolb'); 

            items.forEach(item => {
                const tituloEl = item.querySelector('.job-title, .BjJfJf');
                const empresaEl = item.querySelector('.vNEEBe');
                const ubicacionEl = item.querySelector('.Qk809d');
                const dataJK = item.dataset.jk;
                const googleJobsUrl = `https://www.google.com/search?q=trabajos&ibp=htl;jobs#htivrt=jobs&htidocid=${dataJK}`;

                if (tituloEl && empresaEl) {
                    resultados.push({
                        titulo: tituloEl.innerText.trim(),
                        empresa: empresaEl.innerText.trim(),
                        ubicacion: ubicacionEl ? ubicacionEl.innerText.trim() : 'No especificada',
                        url: googleJobsUrl 
                    });
                }
            });
            return resultados;
        });

        console.log(`✅ ¡Se encontraron ${ofertas.length} ofertas en Google Jobs!`);
        return ofertas;

    } catch (error) {
        console.error(`❌ Error durante la búsqueda en Google Jobs: ${error.message}`);
        if (error.name === 'TimeoutError') {
            console.log('La página tardó demasiado en cargar o Google presentó un CAPTCHA. Intenta de nuevo.');
        }
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = buscarOfertas;