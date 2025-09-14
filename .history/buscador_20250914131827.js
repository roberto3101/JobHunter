// buscador.js - Versión final con enlaces directos

const { GoogleSearch } = require("google-search-results-nodejs");

const API_KEY = "PEGA_AQUÍ_LA_API_KEY_QUE_YA_TIENES";

function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            gl: "us",
            hl: "es"
        };

        search.json(params, (json) => {
            if (json.error) {
                console.error("❌ Error de SerpApi:", json.error);
                resolve([]);
                return;
            }

            const ofertas = json.jobs_results || [];
            console.log(`Procesando ${ofertas.length} ofertas para encontrar enlaces directos...`);

            const ofertasFormateadas = ofertas
                .map(oferta => {
                    // --- ¡CORRECCIÓN CLAVE! ---
                    // Buscamos el enlace directo en la sección 'apply_options'.
                    const applyLink = oferta.apply_options?.[0]?.link;

                    return {
                        titulo: oferta.title,
                        empresa: oferta.company_name,
                        ubicacion: oferta.location,
                        // Guardamos el enlace directo. Si no existe, será 'null'.
                        url: applyLink
                    };
                })
                // Nos quedamos solo con las ofertas que SÍ tienen un enlace directo.
                .filter(oferta => oferta.url); 

            console.log(`✅ ¡Se encontraron ${ofertasFormateadas.length} ofertas con enlace de postulación directo!`);
            resolve(ofertasFormateadas);
        });
    });
}

module.exports = buscarOfertas;