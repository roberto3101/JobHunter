// buscador.js - VERSIÓN CON PAGINACIÓN PARA 30+ RESULTADOS

const { GoogleSearch } = require("google-search-results-nodejs");

// ¡¡¡NO OLVIDES PEGAR TU API KEY AQUÍ!!!
const API_KEY = "a53f8f15803db09bb8b46e82aa18b480a9976792ed3ec2ec2cc6e41660c6790a";

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    const todasLasOfertas = [];
    const NUM_PAGINAS = 3; // 3 páginas x 10 resultados = 30 resultados aproximadamente
    
    for (let pagina = 0; pagina < NUM_PAGINAS; pagina++) {
        console.log(`📄 Obteniendo página ${pagina + 1} de ${NUM_PAGINAS}...`);
        
        const ofertasPagina = await buscarPagina(palabrasClave, pagina * 10);
        
        if (ofertasPagina.length === 0) {
            console.log(`⚠️ No hay más resultados en la página ${pagina + 1}`);
            break; // Si no hay más resultados, salimos del loop
        }
        
        todasLasOfertas.push(...ofertasPagina);
        
        // Pequeña pausa entre peticiones para no sobrecargar la API
        if (pagina < NUM_PAGINAS - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    console.log(`✅ ¡Se encontraron ${todasLasOfertas.length} ofertas en total!`);
    
    // Eliminar duplicados por URL (por si acaso)
    const ofertasUnicas = [];
    const urlsVistas = new Set();
    
    for (const oferta of todasLasOfertas) {
        if (oferta.url && !urlsVistas.has(oferta.url)) {
            urlsVistas.add(oferta.url);
            ofertasUnicas.push(oferta);
        }
    }
    
    console.log(`📊 ${ofertasUnicas.length} ofertas únicas con enlace de postulación directo.`);
    return ofertasUnicas;
}

async function buscarPagina(palabrasClave, start = 0) {
    return new Promise((resolve) => {
        const search = new GoogleSearch(API_KEY);
        
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            hl: "es", // Buscamos en español
            start: start // Parámetro de paginación
        };

        search.json(params, (json) => {
            if (json.error) {
                console.error("❌ Error de SerpApi:", json.error);
                resolve([]);
                return;
            }

            const ofertas = json.jobs_results || [];
            console.log(`   ➜ ${ofertas.length} ofertas en esta página`);

            const ofertasFormateadas = ofertas
                .map(oferta => {
                    const applyLink = oferta.apply_options?.[0]?.link;
                    return {
                        titulo: oferta.title,
                        empresa: oferta.company_name,
                        ubicacion: oferta.location,
                        url: applyLink,
                        descripcion: oferta.description // Agregamos descripción por si la necesitas
                    };
                })
                .filter(oferta => oferta.url);

            resolve(ofertasFormateadas);
        });
    });
}

module.exports = buscarOfertas;