// buscador.js - VERSIÓN RESTAURADA Y SIMPLIFICADA

const { GoogleSearch } = require("google-search-results-nodejs");

// ¡¡¡NO OLVIDES PEGAR TU API KEY AQUÍ!!!
const API_KEY = "PEGA_AQUÍ_LA_API_KEY";

async function buscarOfertas(palabrasClave) {
    // Ya no hay referencia al país
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);
        
        // El objeto de parámetros es más simple
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            hl: "es" // Buscamos en español
        };

        search.json(params, (json) => {
            if (json.error) {
                console.error("❌ Error de SerpApi:", json.error);
                resolve([]);
                return;
            }

            const ofertas = json.jobs_results || [];
            console.log(`✅ ¡Se encontraron ${ofertas.length} ofertas!`);

            const ofertasFormateadas = ofertas
                .map(oferta => {
                    const applyLink = oferta.apply_options?.[0]?.link;
                    return {
                        titulo: oferta.title,
                        empresa: oferta.company_name,
                        ubicacion: oferta.location,
                        url: applyLink
                    };
                })
                .filter(oferta => oferta.url);

            console.log(`Se encontraron ${ofertasFormateadas.length} ofertas con enlace de postulación directo.`);
            resolve(ofertasFormateadas);
        });
    });
}

module.exports = buscarOfertas;