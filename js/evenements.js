
const cartesEvenements = document.querySelectorAll(".event_card");

const cleInscriptions = "the-social-game-inscriptions";
const cleHistorique = "the-social-game-missions";

function lireInscriptions() {
    return JSON.parse(localStorage.getItem(cleInscriptions) || "[]");
}

function afficherInscriptions() {
    const inscriptions = lireInscriptions();

    for (const carte of cartesEvenements) {
        if (!carte.id) {
            console.warn("Événement sans ID :", carte);
            continue;
        }
        const bouton = carte.querySelector(".signup");
        const recompense = carte.querySelector(".points-evenement");

        const inscrit = inscriptions.some(
            inscription => inscription.id === carte.id
        );

        bouton.disabled = false;
        bouton.textContent = inscrit ? "Se désinscrire" : "S'inscrire";

        recompense.textContent = inscrit
            ? (pointsEvenements[carte.id] ?? 0) + " points"
            : "";

        recompense.hidden = !inscrit;
    }
}

for (const carte of cartesEvenements) {
    const bouton = carte.querySelector(".signup");

    bouton.addEventListener("click", function () {
        let inscriptions = lireInscriptions();

        const inscrit = inscriptions.some(
            inscription => inscription.id === carte.id
        );

        if (inscrit) {
            // Remove registration
            inscriptions = inscriptions.filter(
                inscription => inscription.id !== carte.id
            );

            // Remove the event from completed missions
            const historique = JSON.parse(
                localStorage.getItem(cleHistorique) || "[]"
            );

            const nouvelHistorique = historique.filter(
                mission => mission.id !== carte.id
            );

            localStorage.setItem(
                cleHistorique,
                JSON.stringify(nouvelHistorique)
            );

        } else {
            // Register for the event
            const titre = carte.querySelector(".event_title")
                .textContent.trim();

            inscriptions.push({
                id: carte.id,
                titre: titre
            });
        }

        localStorage.setItem(
            cleInscriptions,
            JSON.stringify(inscriptions)
        );

        afficherInscriptions();
    });
}

afficherInscriptions();

window.addEventListener("pageshow", afficherInscriptions);
window.addEventListener("storage", afficherInscriptions);
