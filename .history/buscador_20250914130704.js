// buscador.js - Versión Corregida para la librería google-search-results-nodejs

// La forma correcta de importar la librería es obteniendo la clase 'GoogleSearch'
const { GoogleSearch } = require("google-search-results-nodejs");

const API_KEY = "a53f8f15803db09bb8b46e82aa18b480a9976792ed3ec2ec2cc6e41660c6790a";

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);

    // 1. Creamos una nueva instancia del buscador con nuestra API Key
    const search = new GoogleSearch(API_KEY);

    const params = {
        engine: "google_jobs",
        q: palabrasClave,
        gl: "pe",
        hl: "es"
    };

    // Usamos una sintaxis 'async/await' más moderna y limpia
    try {
        // 2. Ejecutamos la búsqueda usando el método '.json()' de nuestra instancia
        const json = await search.json(params);

        if (json.error) {
            console.error("❌ Error de SerpApi:", json.error);
            return []; // Devolvemos un array vacío si hay un error
        }

        const ofertas = json.jobs_results || [];
        console.log(`✅ ¡Se encontraron ${ofertas.length} ofertas vía API!`);

        const ofertasFormateadas = ofertas.map(oferta => ({
            titulo: oferta.title,
            empresa: oferta.company_name,
            ubicacion: oferta.location,
            url: (oferta.related_links && oferta.related_links[0]?.link) || oferta.via,
        }));

        return ofertasFormateadas;

    } catch (error) {
        console.error("❌ Ocurrió un error al contactar la API:", error);
        return [];
    }
}

module.exports = buscarOfertas;