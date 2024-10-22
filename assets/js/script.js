// Elementos del DOM
const infoPersonajes = document.getElementById("infoPersonajes");
const secciones = document.querySelectorAll(".seccion-personajes");
const lightsaberMp3 = document.getElementById("lightsaberMp3");

// Configuración inicial del audio
if (!lightsaberMp3) {
    console.error("No se encontró el elemento de audio");
} else {
    lightsaberMp3.volume = 1.0;
    lightsaberMp3.load();
}

// Manejador de errores de audio
lightsaberMp3.addEventListener('error', function(e) {
    console.error('Error loading audio:', e);
});

// Función para reproducir el sonido del sable de luz
function playLightsaberSound() {
    try {
        lightsaberMp3.currentTime = 0;
        const playPromise = lightsaberMp3.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Error reproduciendo audio:", error);
            });
        }
    } catch (error) {
        console.error("Error en reproducción:", error);
    }
}

// Función para obtener personajes desde la API
async function obtenerPersonaje(id) {
    try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`);
        const datos = await response.json();
        return {
            nombre: datos.name,
            altura: datos.height,
            peso: datos.mass,
            imagen: `assets/img/${datos.name.toLowerCase().replace(/ /g, "-")}.png`,
        };
    } catch (error) {
        console.error("Error al obtener personaje:", error);
        return null;
    }
}

// Función para mostrar personajes
async function mostrarPersonajes(inicio, fin) {
    infoPersonajes.innerHTML = "";
    let personajesMostrados = 0;

    for (let i = inicio; i <= fin && personajesMostrados < 5; i++) {
        const personaje = await obtenerPersonaje(i);
        if (personaje) {
            const divPersonaje = document.createElement("div");
            divPersonaje.className = "col-md-6 mb-4";
            divPersonaje.innerHTML = `
                <div class="tarjeta-personaje">
                    <div class="imagen-personaje">
                        <img src="${personaje.imagen}" alt="${personaje.nombre}">
                    </div>
                    <h4>${personaje.nombre}</h4>
                    <p>Altura: ${personaje.altura} cm</p>
                    <p>Peso: ${personaje.peso} kg</p>
                </div>
            `;
            infoPersonajes.appendChild(divPersonaje);
            personajesMostrados++;
        }
    }
}

// Configuración de eventos para las secciones
secciones.forEach((seccion) => {
    // Evento al pasar el mouse por encima
    seccion.addEventListener("mouseenter", () => {
        const inicio = parseInt(seccion.dataset.inicio);
        const fin = parseInt(seccion.dataset.fin);
        mostrarPersonajes(inicio, fin);

        // Mostrar la sección correspondiente y ocultar las demás
        document.querySelectorAll(".info-seccion").forEach((info) => {
            info.style.display = "none";
        });
        document.getElementById(`infoSeccion${seccion.dataset.seccion}`).style.display = "block";
    });

    // Evento al hacer click (reproduce el sonido)
    seccion.addEventListener("click", () => {
        playLightsaberSound();
    });
});

// Manejar errores generales
window.addEventListener('error', function(e) {
    console.error('Error general en la página:', e.message);
});
