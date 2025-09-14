// buscador.js - Con geolocalización ampliada para prueba

const { GoogleSearch } = require("google-search-results-nodejs");

const API_KEY = "";

function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);

        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            // --- ¡CAMBIO AQUÍ! ---
            // Cambiamos 'pe' por 'us' para hacer una búsqueda en un mercado más grande
            gl: "us", 
            // ---------------------
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

            const ofertasFormateadas = ofertas.map(oferta => ({
                titulo: oferta.title,
                empresa: oferta.company_name,
                ubicacion: oferta.location,
                url: (oferta.related_links && oferta.related_links[0]?.link) || oferta.via,
            }));

            resolve(ofertasFormateadas);
        });
    });
}

module.exports = buscarOfertas;