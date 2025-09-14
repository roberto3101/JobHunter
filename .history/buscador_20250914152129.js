// buscador.js - VERSIÓN CON TIMEOUT Y MEJOR MANEJO DE ERRORES

const { GoogleSearch } = require("google-search-results-nodejs");

// ¡¡¡NO OLVIDES PEGAR TU API KEY AQUÍ!!!
const API_KEY = "a53f8f15803db09bb8b46e82aa18b480a9976792ed3ec2ec2cc6e41660c6790a";

async function buscarOfertas(palabrasClave) {
    console.log(`🤖 Buscando en Google Jobs vía API con: "${palabrasClave}"`);
    
    try {
        // Primero intentamos obtener la primera página
        const primerasPagina = await buscarPaginaConTimeout(palabrasClave, 0);
        
        if (primerasPagina.length === 0) {
            console.log("⚠️ No se encontraron resultados");
            return [];
        }
        
        console.log(`✅ Primera página obtenida: ${primerasPagina.length} ofertas`);
        
        // Si queremos más resultados, intentamos obtener más páginas
        const todasLasOfertas = [...primerasPagina];
        const INTENTAR_MAS_PAGINAS = true; // Cambia a false si solo quieres 10 resultados
        
        if (INTENTAR_MAS_PAGINAS && primerasPagina.length === 10) {
            // Intentar página 2
            console.log(`📄 Intentando obtener más resultados...`);
            
            try {
                const segundaPagina = await buscarPaginaConTimeout(palabrasClave, 10);
                if (segundaPagina.length > 0) {
                    todasLasOfertas.push(...segundaPagina);
                    console.log(`✅ Segunda página: ${segundaPagina.length} ofertas más`);
                    
                    // Intentar página 3 solo si la página 2 fue exitosa
                    if (segundaPagina.length === 10) {
                        const terceraPagina = await buscarPaginaConTimeout(palabrasClave, 20);
                        if (terceraPagina.length > 0) {
                            todasLasOfertas.push(...terceraPagina);
                            console.log(`✅ Tercera página: ${terceraPagina.length} ofertas más`);
                        }
                    }
                }
            } catch (error) {
                console.log("⚠️ No se pudieron obtener páginas adicionales, continuando con los resultados actuales");
            }
        }
        
        // Eliminar duplicados por URL
        const ofertasUnicas = [];
        const urlsVistas = new Set();
        
        for (const oferta of todasLasOfertas) {
            if (oferta.url && !urlsVistas.has(oferta.url)) {
                urlsVistas.add(oferta.url);
                ofertasUnicas.push(oferta);
            }
        }
        
        console.log(`📊 Total: ${ofertasUnicas.length} ofertas únicas encontradas`);
        return ofertasUnicas;
        
    } catch (error) {
        console.error("❌ Error general en la búsqueda:", error.message);
        return [];
    }
}

async function buscarPaginaConTimeout(palabrasClave, start = 0, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        const search = new GoogleSearch(API_KEY);
        
        // Configurar timeout
        const timeoutId = setTimeout(() => {
            console.log(`⏱️ Timeout alcanzado para página con start=${start}`);
            resolve([]); // Resolvemos con array vacío en lugar de rechazar
        }, timeoutMs);
        
        const params = {
            engine: "google_jobs",
            q: palabrasClave,
            hl: "es",
            start: start
        };
        
        console.log(`   🔍 Buscando con offset ${start}...`);

        try {
            search.json(params, (json) => {
                clearTimeout(timeoutId); // Limpiar timeout si obtenemos respuesta
                
                if (!json) {
                    console.log("   ⚠️ Respuesta vacía de la API");
                    resolve([]);
                    return;
                }
                
                if (json.error) {
                    console.error(`   ❌ Error de SerpApi: ${json.error}`);
                    resolve([]);
                    return;
                }

                const ofertas = json.jobs_results || [];
                console.log(`   ✓ ${ofertas.length} ofertas obtenidas`);

                const ofertasFormateadas = ofertas
                    .map(oferta => {
                        try {
                            const applyLink = oferta.apply_options?.[0]?.link;
                            return {
                                titulo: oferta.title || "Sin título",
                                empresa: oferta.company_name || "Empresa no especificada",
                                ubicacion: oferta.location || "Ubicación no especificada",
                                url: applyLink
                            };
                        } catch (err) {
                            console.log("   ⚠️ Error procesando una oferta:", err.message);
                            return null;
                        }
                    })
                    .filter(oferta => oferta && oferta.url);

                resolve(ofertasFormateadas);
            });
        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`   ❌ Error en búsqueda: ${error.message}`);
            resolve([]);
        }
    });
}

// Versión simple que solo busca 10 resultados (página 1)
async function buscarOfertasSimple(palabrasClave) {
    console.log(`🤖 Búsqueda simple (10 resultados) con: "${palabrasClave}"`);
    const ofertas = await buscarPaginaConTimeout(palabrasClave, 0);
    console.log(`✅ ${ofertas.length} ofertas encontradas`);
    return ofertas;
}

// Exportamos la función principal, pero también la versión simple por si acaso
module.exports = buscarOfertas;
module.exports.buscarOfertasSimple = buscarOfertasSimple;