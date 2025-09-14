// buscador.js - Versión Final con API (SerpApi)

// Importamos la librería de SerpApi
const { getJson } = require("google-search-results-nodejs");

// --- ¡PASO FINAL PARA TI! ---
// Reemplaza el texto de abajo con la clave que ya tienes.
const API_KEY = "";
// ---------------------------------------------------

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);

    const params = {
        api_key: API_KEY,
        engine: "google_jobs",
        q: palabrasClave,
        gl: "pe", // Código de país (Perú)
        hl: "es"  // Idioma (Español)
    };

    return new Promise((resolve) => {
        getJson(params, (json) => {
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