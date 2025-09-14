// buscador.js - Versión para Google Jobs

// Usamos puppeteer-extra y el plugin stealth para no ser detectados
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Iniciando búsqueda en Google Jobs con: "${palabrasClave}"`);
    let browser; // Definimos browser aquí para que esté disponible en finally
    try {
        browser = await puppeteer.launch({
            headless: false, // 'new' para la nueva versión, o `false` para ver el proceso
            defaultViewport: null,
            args: ['--start-maximized'] // Inicia maximizado
        });

        const page = await browser.newPage();

        // Construimos la URL de Google Jobs
        const searchTerm = `${palabrasClave} trabajo`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&ibp=htl;jobs`;

        console.log(`Navegando a: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Esperamos a que el contenedor principal de los trabajos esté visible
        const jobsContainerSelector = '#search-results';
        console.log('Página cargada. Esperando por el contenedor de trabajos...');
        await page.waitForSelector(jobsContainerSelector, { timeout: 15000 });

        console.log('Contenedor encontrado. Extrayendo ofertas...');

        // Hacemos scroll para cargar más resultados (opcional pero recomendado)
        await page.evaluate(async () => {
            const container = document.querySelector('#search-results');
            for (let i = 0; i < 5; i++) { // Hacemos scroll 5 veces
                container.scrollTop = container.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        });

        const ofertas = await page.evaluate(() => {
            const resultados = [];
            // El selector '.iFjolb' parece ser el contenedor de cada oferta en la lista
            const items = document.querySelectorAll('.iFjolb'); 

            items.forEach(item => {
                const tituloEl = item.querySelector('.job-title, .BjJfJf'); // A veces usa una clase u otra
                const empresaEl = item.querySelector('.vNEEBe');
                const ubicacionEl = item.querySelector('.Qk809d');
                
                // Extraemos el ID del trabajo para construir un enlace único
                const dataJK = item.dataset.jk;
                const googleJobsUrl = `https://www.google.com/search?q=trabajos&ibp=htl;jobs#htivrt=jobs&htidocid=${dataJK}`;

                if (tituloEl && empresaEl) {
                    resultados.push({
                        titulo: tituloEl.innerText.trim(),
                        empresa: empresaEl.innerText.trim(),
                        // A veces la ubicación no está, así que lo manejamos
                        ubicacion: ubicacionEl ? ubicacionEl.innerText.trim() : 'No especificada',
                        // Proporcionamos la URL de Google Jobs que a su vez tiene el enlace original
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