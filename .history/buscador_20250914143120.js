// buscador.js

const { GoogleSearch } = require("google-search-results-nodejs");

// ¡¡¡NO OLVIDES PEGAR TU API KEY AQUÍ!!!
const API_KEY = "a53f8f15803db09bb8b46e82aa18b480a9976792ed3ec2ec2cc6e41660c6790a";

async function buscarOfertas(palabrasClave) {
    // La búsqueda está fijada a 'us' como en la versión que funcionaba
    const pais = 'us'; 
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}" en el país: ${pais}`);
    
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            gl: pais,
            hl: "es"
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