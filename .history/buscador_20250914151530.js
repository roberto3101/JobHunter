const { GoogleSearch } = require("google-search-results-nodejs");

const API_KEY = "a53f8f15803db09bb8b46e82aa18b480a9976792ed3ec2ec2cc6e41660c6790a";

async function buscarPagina(params) {
    const search = new GoogleSearch(API_KEY);
    return new Promise((resolve) => {
        search.json(params, (json) => {
            resolve(json.jobs_results || []);
        });
    });
}

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    let todasLasOfertas = [];
    let seguirBuscando = true;
    let pagina = 0;
    
    // --- AQUÍ ESTÁ LA LÍNEA ---
    // Puedes cambiar este número a 50, 100, etc.
    const LIMITE_DE_RESULTADOS = 50; 
    // -------------------------

    while (seguirBuscando && todasLasOfertas.length < LIMITE_DE_RESULTADOS) {
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            hl: "es",
            start: pagina * 10 // Paginación: 0, 10, 20...
        };

        console.log(`Buscando página ${pagina + 1}...`);
        const ofertasDePagina = await buscarPagina(params);

        if (ofertasDePagina.length > 0) {
            todasLasOfertas.push(...ofertasDePagina);
            pagina++;
        } else {
            seguirBuscando = false; // Si una página no devuelve resultados, paramos.
        }
    }

    if (todasLasOfertas.length === 0) {
        console.log(`❌ No se encontraron resultados para "${palabrasClave}".`);
        return [];
    }
    
    console.log(`✅ ¡Se encontraron ${todasLasOfertas.length} ofertas en total!`);

    const ofertasFormateadas = todasLasOfertas
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
    return ofertasFormateadas;
}

module.exports = buscarOfertas;