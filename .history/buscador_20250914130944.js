// buscador.js - Versión Definitiva con el manejo correcto de la API

const { GoogleSearch } = require("google-search-results-nodejs");

const API_KEY = "";

function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    // Envolvemos toda la lógica en una Promesa para que funcione con el resto de la app
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);

        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            gl: "pe",
            hl: "es"
        };

        // Usamos el método de 'callback', que es el método oficial de la librería
        search.json(params, (json) => {
            // Este código se ejecuta cuando la API responde
            if (json.error) {
                console.error("❌ Error de SerpApi:", json.error);
                resolve([]); // Si hay un error, resolvemos con un array vacío
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

            resolve(ofertasFormateadas); // Resolvemos la promesa con los datos formateados
        });
    });
}

module.exports = buscarOfertas;