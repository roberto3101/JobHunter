// CYBERPUNK RENDERER - Enhanced UI Controller
// Manages all UI interactions and job search functionality

document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-buscar');
    const palabrasClaveInput = document.getElementById('palabras-clave');
    const listaOfertasDiv = document.getElementById('lista-ofertas');
    const loader = document.getElementById('loader');
    const resultCount = document.getElementById('result-count');
    
    // Terminal typing effect
    let terminalMessages = [];
    
    // Search button click handler with cyberpunk effects
    btnBuscar.addEventListener('click', async () => {
        const palabrasClave = palabrasClaveInput.value;

        if (!palabrasClave) {
            showCyberAlert('⚠ ALERTA: Ingresa parámetros de búsqueda válidos');
            glitchEffect(palabrasClaveInput);
            return;
        }

        // Start search sequence
        initSearchSequence();
        
        try {
            addTerminalMessage('INICIANDO_PROTOCOLO_DE_BÚSQUEDA...');
            addTerminalMessage(`PARÁMETROS: [${palabrasClave.toUpperCase()}]`);
            addTerminalMessage('CONECTANDO_A_SERVIDORES_CORPORATIVOS...');
            
            // Simulate scanning effect
            await simulateScanning();
            
            const ofertas = await window.electronAPI.buscarOfertas(palabrasClave);
            
            addTerminalMessage(`ESCANEO_COMPLETO: ${ofertas.length} OBJETIVOS_DETECTADOS`);
            resultCount.textContent = ofertas.length;
            
            mostrarOfertas(ofertas);
            
        } catch (error) {
            addTerminalMessage('❌ ERROR_CRÍTICO: Fallo en la conexión neural');
            listaOfertasDiv.innerHTML = `
                <div class="error-message cyber-error">
                    <span class="error-icon">⚠</span>
                    <span>SISTEMA_COMPROMETIDO: Reiniciando protocolo...</span>
                </div>
            `;
        } finally {
            loader.classList.add('hidden');
            completeSearchSequence();
        }
    });

    // Initialize search sequence with visual effects
    function initSearchSequence() {
        loader.classList.remove('hidden');
        listaOfertasDiv.innerHTML = '';
        btnBuscar.disabled = true;
        btnBuscar.innerHTML = '<span class="button-text">ESCANEANDO...</span><div class="button-bg"></div>';
        
        // Add scanning class to panel
        const searchPanel = document.getElementById('search-matrix');
        searchPanel.querySelector('.panel-status').classList.add('scanning');
        
        // Visual feedback
        document.querySelector('.main-container').classList.add('scanning-