const infoPersonajes = document.getElementById("infoPersonajes");
const secciones = document.querySelectorAll(".seccion-personajes");
const lightsaberMp3 = document.getElementById("lightsaberMp3");

lightsaberMp3.volume = 1.0; // Asegurar volumen máximo

// Reproduce el sonido cuando está listo
lightsaberMp3.addEventListener("canplaythrough", function () {
  lightsaberMp3.play();
});

// Función para obtener personajes desde la API
async function obtenerPersonaje(id) {
  try {
    const response = await fetch(`https://swapi.dev/api/people/${id}/`);
    const datos = await response.json();
    return {
      nombre: datos.name,
      altura: datos.height,
      peso: datos.mass,
      imagen: `assets/img/${datos.name.toLowerCase().replace(/ /g, "-")}.png`, //transforma el nombre de la imagen
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Mostrar personajes
async function mostrarPersonajes(inicio, fin) {
  infoPersonajes.innerHTML = ""; // Limpiar la sección de personajes
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

// Eventos para mostrar personajes y reproducir sonido
secciones.forEach((seccion) => {
  seccion.addEventListener("mouseenter", () => {
    const inicio = parseInt(seccion.dataset.inicio);
    const fin = parseInt(seccion.dataset.fin);
    mostrarPersonajes(inicio, fin);

    // Mostrar la sección correspondiente y ocultar las demás
    document.querySelectorAll(".info-seccion").forEach((info) => {
      info.style.display = "none";
    });
    document.getElementById(
      `infoSeccion${seccion.dataset.seccion}`
    ).style.display = "block";
  });

  // Reproduce sonido de lightsaber cuando se hace clic en la sección
  seccion.addEventListener("click", () => {
    lightsaberMp3.play();
  });
});

// Ocultar todas las secciones al inicio
document.querySelectorAll(".info-seccion").forEach((info) => {
  info.style.display = "none";
});
