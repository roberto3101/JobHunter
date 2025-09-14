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
        document.querySelector('.main-container').classList.add('scanning-mode');
    }

    // Complete search sequence
    function completeSearchSequence() {
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = '<span class="button-text">INICIAR_ESCANEO</span><div class="button-bg"></div>';
        
        const searchPanel = document.getElementById('search-matrix');
        searchPanel.querySelector('.panel-status').classList.remove('scanning');
        
        document.querySelector('.main-container').classList.remove('scanning-mode');
    }

    // Simulate scanning effect
    async function simulateScanning() {
        const sectors = ['SECTOR_ALPHA', 'SECTOR_BETA', 'SECTOR_GAMMA', 'SECTOR_DELTA'];
        const analyzingText = document.querySelector('.analyzing-text');
        
        for (let sector of sectors) {
            if (analyzingText) {
                analyzingText.textContent = sector;
            }
            await delay(500);
        }
    }

    // Display job offers with cyberpunk styling
    function mostrarOfertas(ofertas) {
        if (ofertas.length === 0) {
            listaOfertasDiv.innerHTML = `
                <div class="terminal-line">
                    <span class="terminal-time">[${getCurrentTime()}]</span>
                    <span class="terminal-message warning">NO_SE_DETECTARON_OBJETIVOS_EN_EL_SECTOR</span>
                </div>
            `;
            return;
        }

        listaOfertasDiv.innerHTML = '';
        
        ofertas.forEach((oferta, index) => {
            setTimeout(() => {
                const ofertaElement = createCyberJobCard(oferta, index);
                listaOfertasDiv.appendChild(ofertaElement);
                
                // Animate entry with GSAP if available
                if (typeof gsap !== 'undefined') {
                    gsap.from(ofertaElement, {
                        x: -100,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                } else {
                    // Fallback animation with CSS
                    ofertaElement.style.animation = 'slideIn 0.5s ease-out';
                }
            }, index * 100);
        });
        
        // Add event listeners to all apply buttons
        setTimeout(() => {
            document.querySelectorAll('.apply-btn').forEach(button => {
                button.addEventListener('click', handleAutocompletar);
            });
        }, ofertas.length * 100 + 100);
    }

    // Create cyberpunk-styled job card
    function createCyberJobCard(oferta, index) {
        const ofertaElement = document.createElement('div');
        ofertaElement.className = 'job-offer';
        ofertaElement.innerHTML = `
            <div class="job-header">
                <div>
                    <h3 class="job-title">
                        <span class="job-index">[${String(index + 1).padStart(3, '0')}]</span>
                        ${oferta.titulo}
                    </h3>
                    <div class="job-company">${oferta.empresa}</div>
                    <div class="job-location">${oferta.ubicacion || 'UBICACIÓN_CLASIFICADA'}</div>
                </div>
                <div class="job-status">
                    <span class="status-indicator active"></span>
                    <span>ACTIVO</span>
                </div>
            </div>
            <div class="job-meta">
                <div class="meta-item">
                    <span class="meta-icon">⚡</span>
                    <span>PRIORIDAD_ALTA</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">◈</span>
                    <span>ACCESO_NIVEL_5</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">⬡</span>
                    <span>RECOMPENSA_PREMIUM</span>
                </div>
            </div>
            <div class="job-action">
                <button class="apply-btn" data-url="${oferta.url}">
                    <span class="btn-text">INFILTRAR_SISTEMA</span>
                    <span class="btn-icon">►</span>
                </button>
            </div>
        `;
        
        return ofertaElement;
    }

    // Handle auto-complete with cyberpunk feedback
    async function handleAutocompletar(event) {
        const button = event.target.closest('.apply-btn');
        const url = button.getAttribute('data-url');
        
        const datosPersonales = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
        };

        if (!datosPersonales.nombre || !datosPersonales.email) {
            showCyberAlert('⚠ ERROR: Credenciales incompletas. Acceso denegado.');
            glitchEffect(document.getElementById('neural-interface'));
            return;
        }

        // Visual feedback
        button.innerHTML = '<span class="btn-text">INFILTRANDO...</span>';
        button.disabled = true;
        
        try {
            addTerminalMessage('INICIANDO_PROTOCOLO_DE_INFILTRACIÓN...');
            addTerminalMessage('INYECTANDO_DATOS_PERSONALES...');
            addTerminalMessage('BYPASS_DE_SEGURIDAD_EN_PROGRESO...');
            
            const resultado = await window.electronAPI.autocompletar({ url, datosPersonales });
            
            if (resultado && resultado.success) {
                addTerminalMessage('✓ INFILTRACIÓN_EXITOSA: Sistema comprometido');
                button.innerHTML = '<span class="btn-text">COMPLETADO</span>';
                button.classList.add('success');
            } else {
                throw new Error('Infiltración fallida');
            }
        } catch (error) {
            addTerminalMessage('❌ INFILTRACIÓN_FALLIDA: Firewall activo');
            button.innerHTML = '<span class="btn-text">REINTENTAR</span>';
            button.disabled = false;
        }
    }

    // Add terminal message with typing effect
    function addTerminalMessage(message) {
        const terminalOutput = document.getElementById('lista-ofertas');
        const messageLine = document.createElement('div');
        messageLine.className = 'terminal-line';
        messageLine.innerHTML = `
            <span class="terminal-time">[${getCurrentTime()}]</span>
            <span class="terminal-message typing">${message}</span>
        `;
        
        if (terminalOutput.children.length > 10) {
            terminalOutput.removeChild(terminalOutput.firstChild);
        }
        
        terminalOutput.appendChild(messageLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        
        // Remove typing class after animation
        setTimeout(() => {
            messageLine.querySelector('.terminal-message').classList.remove('typing');
        }, 1000);
    }

    // Show cyber-styled alert
    function showCyberAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'cyber-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">⚠</span>
                <span class="alert-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // Animate with GSAP if available, otherwise use CSS
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(alert, 
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 0.3 }
            );
            
            setTimeout(() => {
                gsap.to(alert, {
                    opacity: 0,
                    y: -50,
                    duration: 0.3,
                    onComplete: () => alert.remove()
                });
            }, 3000);
        } else {
            alert.style.animation = 'fadeInDown 0.3s ease-out';
            setTimeout(() => {
                alert.style.animation = 'fadeOutUp 0.3s ease-out';
                setTimeout(() => alert.remove(), 300);
            }, 3000);
        }
    }

    // Apply glitch effect to element
    function glitchEffect(element) {
        element.classList.add('glitch-active');
        setTimeout(() => {
            element.classList.remove('glitch-active');
        }, 500);
    }

    // Get current time in format HH:MM:SS
    function getCurrentTime() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    // Utility delay function
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Input field enhancements
    const inputs = document.querySelectorAll('.cyber-input, .cyber-search');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
            playTypingSound();
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
        
        input.addEventListener('input', function() {
            if (this.value.length % 5 === 0) {
                playKeySound();
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to search
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            btnBuscar.click();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            palabrasClaveInput.value = '';
            palabrasClaveInput.focus();
        }
    });

    // Sound effects (placeholder functions)
    function playTypingSound() {
        // Add sound effect here
        console.log('Typing sound');
    }
    
    function playKeySound() {
        // Add sound effect here
        console.log('Key sound');
    }

    // Initial terminal message
    addTerminalMessage('SISTEMA_NEXUS_v2.077_INICIADO');
    addTerminalMessage('Conectando a la red corporativa...');
    addTerminalMessage('Esperando comandos del usuario...');

    // Add hover effects to panels
    document.querySelectorAll('.cyber-panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(panel, {
                    boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
                    duration: 0.3
                });
            } else {
                panel.style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.8)';
            }
        });
        
        panel.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(panel, {
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                    duration: 0.3
                });
            } else {
                panel.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            }
        });
    });

    // Animate status values
    setInterval(() => {
        document.querySelectorAll('.hud-value').forEach(element => {
            if (element.textContent.includes('%')) {
                const currentValue = parseInt(element.textContent);
                const newValue = Math.max(0, Math.min(100, currentValue + (Math.random() - 0.5) * 10));
                element.textContent = Math.round(newValue) + '%';
            }
            if (element.textContent.includes('GB')) {
                const currentValue = parseFloat(element.textContent);
                const newValue = Math.max(0.5, Math.min(8, currentValue + (Math.random() - 0.5) * 0.5));
                element.textContent = newValue.toFixed(1) + 'GB';
            }
        });
    }, 2000);

    // Add CSS animation fallbacks
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInDown {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOutUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-50px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});