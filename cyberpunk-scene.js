// CYBERPUNK 3D SCENE CONTROLLER
// Three.js Advanced Scene with Interactive Elements

let scene, camera, renderer;
let particles, grid, neonLights;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let animationId;
let geometricShapes = [];
let time = 0;

// Initialize Three.js Scene
function initThreeScene() {
    // Create Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.001);

    // Setup Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 30);
    camera.lookAt(0, 0, 0);

    // Setup Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add Lights
    setupLighting();

    // Create Grid
    createCyberGrid();

    // Create Particle System
    createParticleSystem();

    // Create Floating Geometric Shapes
    createGeometricShapes();

    // Create Neon Lines
    createNeonLines();

    // Add Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Start Animation
    animate();
}

// Setup Lighting System
function setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.5);
    scene.add(ambientLight);

    // Main Directional Light
    const mainLight = new THREE.DirectionalLight(0x00ffff, 1);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    scene.add(mainLight);

    // Colored Point Lights
    const colors = [0xff00ff, 0x00ffff, 0xffff00];
    colors.forEach((color, i) => {
        const light = new THREE.PointLight(color, 2, 50);
        light.position.set(
            Math.cos(i * Math.PI * 2 / 3) * 20,
            5,
            Math.sin(i * Math.PI * 2 / 3) * 20
        );
        scene.add(light);

        // Animated light movement
        light.userData = {
            originalPos: light.position.clone(),
            offset: i * Math.PI * 2 / 3
        };
    });

    // Spot Lights for dramatic effect
    const spotLight1 = new THREE.SpotLight(0xff00ff, 2);
    spotLight1.position.set(-15, 30, 15);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.5;
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0x00ffff, 2);
    spotLight2.position.set(15, 30, -15);
    spotLight2.angle = Math.PI / 6;
    spotLight2.penumbra = 0.5;
    spotLight2.castShadow = true;
    scene.add(spotLight2);
}

// Create Cyberpunk Grid
function createCyberGrid() {
    const gridSize = 100;
    const divisions = 30;
    
    // Main grid
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x00ffff, 0x00ffff);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // Secondary grid with different color
    const gridHelper2 = new THREE.GridHelper(gridSize, divisions/2, 0xff00ff, 0xff00ff);
    gridHelper2.material.opacity = 0.1;
    gridHelper2.material.transparent = true;
    gridHelper2.position.y = -10.1;
    scene.add(gridHelper2);

    // Animated grid lines
    grid = gridHelper;
}

// Create Particle System
function createParticleSystem() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = Math.random() * 50 - 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        // Color (cyan to magenta gradient)
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Size
        sizes[i] = Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader Material for particles
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute float size;
            uniform float time;
            uniform float pixelRatio;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float animated = size * (1.0 + sin(time + position.x * 0.1) * 0.5);
                gl_PointSize = animated * pixelRatio * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float r = distance(gl_PointCoord, vec2(0.5));
                if (r > 0.5) discard;
                
                float opacity = 1.0 - smoothstep(0.0, 0.5, r);
                gl_FragColor = vec4(vColor, opacity);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create Floating Geometric Shapes
function createGeometricShapes() {
    const geometries = [
        new THREE.IcosahedronGeometry(2, 0),
        new THREE.OctahedronGeometry(2, 0),
        new THREE.TetrahedronGeometry(2, 0),
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.DodecahedronGeometry(2, 0)
    ];

    const materials = [
        new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        }),
        new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        }),
        new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        })
    ];

    for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 20 - 5,
            (Math.random() - 0.5) * 40
        );

        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatRange: Math.random() * 5 + 2,
            originalY: mesh.position.y
        };

        geometricShapes.push(mesh);
        scene.add(mesh);
    }
}

// Create Neon Lines
function createNeonLines() {
    const lineCount = 20;
    
    for (let i = 0; i < lineCount; i++) {
        const points = [];
        const lineLength = 10;
        
        for (let j = 0; j < lineLength; j++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 50
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const line = new THREE.Line(geometry, material);
        line.userData = {
            originalOpacity: 0.3,
            pulseSpeed: Math.random() * 2 + 1
        };
        
        scene.add(line);
    }
}

// Animation Loop
function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.01;

    // Update camera based on mouse
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
    camera.rotation.x += 0.05 * (targetY - camera.rotation.x);

    // Rotate particles
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.material.uniforms.time.value = time;
    }

    // Animate grid
    if (grid) {
        grid.position.y = -10 + Math.sin(time) * 0.5;
    }

    // Animate geometric shapes
    geometricShapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
        
        shape.position.y = shape.userData.originalY + 
            Math.sin(time * shape.userData.floatSpeed) * shape.userData.floatRange;
    });

    // Animate lights
    scene.children.forEach(child => {
        if (child instanceof THREE.PointLight && child.userData.originalPos) {
            const offset = child.userData.offset;
            child.position.x = child.userData.originalPos.x + Math.sin(time + offset) * 5;
            child.position.z = child.userData.originalPos.z + Math.cos(time + offset) * 5;
            child.intensity = 2 + Math.sin(time * 2 + offset) * 0.5;
        }
    });

    renderer.render(scene, camera);
}

// Event Handlers
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

// Initialize Digital Rain Effect
function initDigitalRain() {
    const rainContainer = document.getElementById('rain');
    const dropCount = 15; // REDUCIDO de 50 a 15 gotas
    
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = Math.random() * 3 + 2 + 's'; // Más lento
        drop.style.animationDelay = Math.random() * 5 + 's'; // Más delay
        drop.style.opacity = '0.3'; // Más transparente
        rainContainer.appendChild(drop);
    }
}

// Initialize Particle Effect
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = 20 + Math.random() * 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize Clock
function initClock() {
    function updateClock() {
        const now = new Date();
        const date = `2077.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (dateElement) dateElement.textContent = date;
        if (timeElement) timeElement.textContent = time;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// Initialize All Effects
document.addEventListener('DOMContentLoaded', () => {
    initThreeScene();
    initDigitalRain();
    initParticles();
    initClock();

    // Tag Click Handler
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const searchInput = document.getElementById('palabras-clave');
            searchInput.value = this.dataset.tag;
            searchInput.focus();
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 100);
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('alt-theme');
        });
    }

    // Sound Toggle (placeholder)
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            // Add sound functionality here
            console.log('Sound toggle clicked');
        });
    }

    // Effects Toggle
    const effectsToggle = document.getElementById('effects-toggle');
    if (effectsToggle) {
        effectsToggle.addEventListener('click', () => {
            const scanLines = document.querySelector('.scan-lines');
            const rain = document.querySelector('.rain-container');
            const particles = document.querySelector('.particles');
            
            scanLines.classList.toggle('hidden');
            rain.classList.toggle('hidden');
            particles.classList.toggle('hidden');
        });
    }

    // Add glitch effect on hover to panels
    document.querySelectorAll('.cyber-panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.animation = 'glitch-skew 0.3s';
            setTimeout(() => {
                panel.style.animation = '';
            }, 300);
        });
    });
});