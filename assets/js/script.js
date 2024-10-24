// Generar estrellas
const starsContainer = document.querySelector('.stars');
for (let i = 0; i < 200; i++) { // Aumentado el número de estrellas
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    starsContainer.appendChild(star);
}
// Manejo de personajes
document.querySelectorAll(".rango").forEach(rango => {
    rango.addEventListener("mouseenter", function () {
        const range = this.getAttribute("data-range");
        const [start, end] = range.split('-').map(Number);
        obtenerPersonajes(this, start, end);
    });
});
async function obtenerPersonajes(section, start, end) {
    const container = section.querySelector('.personajes-container');
    if (section.getAttribute("isLoading") === "true") {
        return;
    }
    let characterNumber = section.getAttribute("characterNumber") || start;
    section.setAttribute("isLoading", true);
    for (let i = start; i <= end; i++) {
        if (characterNumber == i) {
            try {
                const response = await fetch(`https://swapi.dev/api/people/${i}/`);
                const personaje = await response.json();
                mostrarPersonaje(container, personaje);
                section.setAttribute("characterNumber", i + 1);
            } catch (error) {
                console.error('Error obteniendo personaje:', error);
            }
        }
    }
    section.setAttribute("isLoading", false);
}
function mostrarPersonaje(container, personaje) {
    const div = document.createElement('div');
    div.classList.add('personaje-card');
    const imageName = personaje.name.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[\'\"]/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w-]/g, "");
    const imagePath = `assets/img/${imageName}.png`;
    div.innerHTML = `
    <div class="personaje-image" style="background-image: url('${imagePath}');"></div>
    <h2>${personaje.name}</h2>
    <p><strong>Estatura:</strong> ${personaje.height} cm</p>
    <p><strong>Peso:</strong> ${personaje.mass} kg</p>
  `;
    container.appendChild(div);
}
