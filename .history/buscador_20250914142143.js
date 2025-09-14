const { GoogleSearch } = require("google-search-results-nodejs");

// ¡¡¡NO OLVIDES PEGAR TU API KEY AQUÍ!!!
const API_KEY = "";

async function buscarPagina(params) {
    const search = new GoogleSearch(API_KEY);
    return new Promise((resolve) => {
        search.json(params, (json) => {
            resolve(json.jobs_results || []);
        });
    });
}

async function buscarOfertas(palabrasClave, pais) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}" en el país: ${pais}`);
    
    let todasLasOfertas = [];
    let seguirBuscando = true;
    let pagina = 0;
    const LIMITE_DE_RESULTADOS = 100;

    while (seguirBuscando && todasLasOfertas.length < LIMITE_DE_RESULTADOS) {
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            gl: pais,
            hl: "es",
            start: pagina * 10
        };

        console.log(`Buscando página ${pagina + 1}...`);
        const ofertasDePagina = await buscarPagina(params);

        if (ofertasDePagina.length > 0) {
            todasLasOfertas.push(...ofertasDePagina);
            pagina++;
        } else {
            seguirBuscando = false;
        }
    }

    if (todasLasOfertas.length === 0) {
        console.log(`❌ No se encontraron resultados para "${palabrasClave}" en el país "${pais}". Prueba con otros términos o cambia el país.`);
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