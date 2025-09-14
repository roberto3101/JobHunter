// buscador.js - Versión Definitiva con construcción de URL 100% fiable

const { GoogleSearch } = require("google-search-results-nodejs");

const API_KEY = ""; // No olvides poner tu clave API

function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);

        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            gl: "us", // Usamos 'us' para tener más resultados
            hl: "es"
        };

        search.json(params, (json) => {
            if (json.error) {
                console.error("❌ Error de SerpApi:", json.error);
                resolve([]);
                return;
            }

            const ofertas = json.jobs_results || [];
            console.log(`✅ ¡Se encontraron ${ofertas.length} ofertas vía API!`);

            const ofertasFormateadas = ofertas.map(oferta => {
                // --- ¡ESTA ES LA CORRECCIÓN CLAVE! ---
                // Construimos la URL canónica de Google Jobs usando el 'job_id'.
                // Esta URL siempre será válida y es la que nuestro asistente espera.
                const googleJobsUrl = `https://www.google.com/search?q=trabajos&ibp=htl;jobs#htivrt=jobs&htidocid=${oferta.job_id}`;

                return {
                    titulo: oferta.title,
                    empresa: oferta.company_name,
                    ubicacion: oferta.location,
                    url: googleJobsUrl // Usamos la URL que acabamos de construir.
                };
            });

            resolve(ofertasFormateadas);
        });
    });
}

module.exports = buscarOfertas;