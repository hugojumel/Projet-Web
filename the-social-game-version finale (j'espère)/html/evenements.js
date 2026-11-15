const cartesEvenements = document.querySelectorAll(".event_card");
const cleInscriptions = "the-social-game-inscriptions";

function lireInscriptions() {
    return JSON.parse(localStorage.getItem(cleInscriptions) || "[]");
}

function afficherInscriptions() {
    const inscriptions = lireInscriptions();

    for (const carte of cartesEvenements) {
        const bouton = carte.querySelector(".signup");
        const recompense = carte.querySelector(".points-evenement");
        const inscrit = inscriptions.some(inscription => inscription.id === carte.id);
        recompense.textContent = pointsEvenements[carte.id] + " points";
        bouton.disabled = inscrit;
        bouton.textContent = inscrit ? "Inscrit" : "S’inscrire";
    }
}

for (const carte of cartesEvenements) {
    const bouton = carte.querySelector(".signup");

    bouton.addEventListener("click", function () {
        const inscriptions = lireInscriptions();

        if (!inscriptions.some(inscription => inscription.id === carte.id)) {
            const titre = carte.querySelector(".event_title").textContent.trim();
            inscriptions.push({ id: carte.id, titre: titre });
            localStorage.setItem(cleInscriptions, JSON.stringify(inscriptions));
        }

        afficherInscriptions();
    });
}

afficherInscriptions();
window.addEventListener("pageshow", afficherInscriptions);
window.addEventListener("storage", afficherInscriptions);
