Asistente de Postulación Automatizado 🤖
Un bot de escritorio construido con Electron y Node.js para automatizar la búsqueda y preparación de postulaciones de empleo. Esta herramienta utiliza SerpApi para realizar búsquedas de trabajo centralizadas y Puppeteer para autocompletar formularios, ahorrando horas en el proceso de búsqueda de empleo.

⚠️ Nota sobre el Estado del Proyecto
Este proyecto es un prototipo funcional diseñado para demostrar las capacidades de la automatización de búsqueda y postulación. La búsqueda de empleos es robusta y obtiene una gran cantidad de resultados.

La funcionalidad de autocompletado está actualmente implementada para la plataforma Greenhouse. El soporte para otros portales como LinkedIn, Indeed o Lever es una futura mejora y requeriría añadir lógica específica en el archivo asistente.js.

## Características Principales ✨
Búsqueda Global: Busca ofertas de empleo en cientos de sitios a la vez a través de la API de Google Jobs.

Resultados Múltiples: Obtiene hasta 100 resultados por búsqueda para una visión amplia del mercado.

Asistente de Autocompletado: Abre un navegador y rellena automáticamente los campos del formulario de postulación (nombre, email, teléfono, etc.).

Perfil Persistente: Utiliza un perfil de navegador dedicado para el bot, permitiendo mantener sesiones iniciadas entre postulaciones.

Interfaz Gráfica Simple: Una interfaz de usuario limpia y directa para gestionar tus datos, búsquedas y resultados.

## Tecnologías Usadas 💻
Framework: Electron

Backend: Node.js

Automatización de Navegador: Puppeteer-Extra con Stealth Plugin

API de Búsqueda: SerpApi para Google Jobs

Interfaz: HTML5, CSS3, JavaScript (Vanilla)

## Instalación y Configuración 🔧
Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

### 1. Prerrequisitos
Asegúrate de tener Node.js (que incluye npm) instalado en tu sistema.

### 2. Clona el Repositorio
Abre tu terminal o consola y clona este repositorio en tu máquina:

Bash

git clone https://github.com/TU_USUARIO/NOMBRE_DEL_PROYECTO.git
cd NOMBRE_DEL_PROYECTO
### 3. Instala las Dependencias
Una vez dentro de la carpeta del proyecto, instala todas las librerías necesarias:

Bash

npm install
### 4. Configura tu Clave de API (Paso Obligatorio)
La búsqueda de empleos depende de la API de SerpApi.

Regístrate en SerpApi: Ve a SerpApi.com y crea una cuenta gratuita (puedes usar tu cuenta de Google). El plan gratuito te da 100 búsquedas al mes.

Obtén tu Clave: Una vez registrado, ve a tu Dashboard. En la parte izquierda, verás una clave larga. Esa es tu "API Key". Cópiala.

Pégala en el Código:

Abre el archivo buscador.js.

Busca la línea: const API_KEY = "PEGA_AQUÍ_LA_API_KEY";

Reemplaza "PEGA_AQUÍ_LA_API_KEY" con la clave que copiaste.

### 5. Añade tu Currículum
Busca la carpeta tu_cv en el proyecto.

Coloca tu currículum en formato PDF dentro de esa carpeta.

Asegúrate de que el archivo se llame exactamente mi_cv.pdf.

## ¿Cómo Ejecutar el Proyecto? ▶️
Una vez completada la configuración, puedes iniciar la aplicación.

Inicia la App:
Desde la terminal, en la carpeta del proyecto, ejecuta:

Bash

npm start
Espera el Inicio: Se abrirán dos ventanas: la interfaz de la aplicación y una ventana de navegador (posiblemente en blanco). Esta segunda ventana es el navegador del bot. No la cierres, puedes minimizarla.

Ingresa tus Datos: En la aplicación, rellena los campos del "Paso 1".

Realiza una Búsqueda: Escribe una palabra clave (ej. "Nodejs Developer") y haz clic en "Buscar Empleos".

Usa el Asistente: Haz clic en "Autocompletar Postulación" en una oferta. Se abrirá una nueva pestaña en el navegador del bot, te llevará al formulario y lo rellenará si es una plataforma soportada.

Envía la Postulación: Revisa el formulario y envía tu postulación manualmente.

## Futuras Mejoras 🚀
Añadir soporte de autocompletado para más plataformas (Lever, Indeed, LinkedIn).

Crear un archivo de configuración (config.json) para gestionar los datos del usuario y la API Key fuera del código.

Implementar un sistema de seguimiento de las postulaciones enviadas.

## Licencia 📄
Este proyecto está bajo la Licencia MIT.
