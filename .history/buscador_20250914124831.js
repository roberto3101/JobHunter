// buscador.js - Versión Septiembre 2025 (compatible con la nueva estructura de Google)

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Iniciando búsqueda en Google Jobs con: "${palabrasClave}"`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            executablePath: chromePath,
            defaultViewport: null,
            args: ['--start-maximized', '--window-size=1600,900'] // Tamaño de ventana para asegurar que se cargue la vista de lista
        });

        const page = await browser.newPage();
        const searchTerm = `${palabrasClave} trabajo`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&ibp=htl;jobs`;

        console.log(`Navegando a: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Selector para el panel izquierdo donde aparecen los trabajos
        const jobListSelector = 'div.gws-plugins-horizon-jobs__tl-lfs'; 
        console.log('Página cargada. Esperando por la lista de trabajos...');
        await page.waitForSelector(jobListSelector, { timeout: 20000 });

        console.log('Lista encontrada. Extrayendo ofertas...');

        const ofertas = await page.evaluate(() => {
            const resultados = [];
            // El nuevo selector para cada item de la lista es un <li> con el atributo data-jk
            const items = document.querySelectorAll('li[data-jk]'); 

            items.forEach(item => {
                // Nuevos selectores internos para cada pieza de información
                const tituloEl = item.querySelector('div[role="heading"]');
                const empresaEl = item.querySelector('span.sMzYuf');
                const ubicacionEl = item.querySelector('div.flSAI');
                
                const dataJK = item.dataset.jk; // El ID único del trabajo
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

        if (ofertas.length === 0) {
            console.log('No se extrajeron ofertas. Google puede haber mostrado un CAPTCHA o cambiado su estructura de nuevo.');
        } else {
            console.log(`✅ ¡Se encontraron ${ofertas.length} ofertas en Google Jobs!`);
        }
        return ofertas;

    } catch (error) {
        console.error(`❌ Error durante la búsqueda en Google Jobs: ${error.message}`);
        if (error.name === 'TimeoutError') {
            console.log('La página tardó demasiado en cargar. Revisa tu conexión o si Google te está pidiendo verificar que no eres un robot.');
        }
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = buscarOfertas;