const listeMissions = document.getElementById("liste-missions");
const casesMissions = Array.from(listeMissions.querySelectorAll('input[type="checkbox"]'));
const pointsSemaine = document.getElementById("points-semaine");
const missionsCompletees = document.getElementById("missions-completees");
const nombreMissions = document.getElementById("nombre-missions");
const missionsRestantes = document.getElementById("missions-restantes");
const progression = document.getElementById("progression");
const pourcentage = document.getElementById("pourcentage");
const cleHistorique = "the-social-game-missions";
const cleInscriptions = "the-social-game-inscriptions";

function identifiantMission(caseMission) {
    if (caseMission.id.startsWith("evenement-")) {
        return caseMission.id;
    }
    return listeMissions.dataset.semaine + "-" + caseMission.id;
}

function creerMissionValidee(caseMission) {
    return {
        id: identifiantMission(caseMission),
        nom: caseMission.parentElement.querySelector(".mission").textContent.trim(),
        points: Number(caseMission.dataset.points),
        date: new Date().toISOString(),
    };
}

function lireHistorique() {
    return JSON.parse(localStorage.getItem(cleHistorique) || "[]");
}

function mettreAJourDashboard() {
    let totalPoints = 0;
    let nombreCompletees = 0;

    for (const caseMission of casesMissions) {
        if (caseMission.checked) {
            totalPoints += Number(caseMission.dataset.points);
            nombreCompletees += 1;
        }
    }

    pointsSemaine.textContent = totalPoints;
    missionsCompletees.textContent = nombreCompletees;
    nombreMissions.textContent = casesMissions.length;
    missionsRestantes.textContent = casesMissions.length - nombreCompletees;
    progression.max = casesMissions.length;
    progression.value = nombreCompletees;
    pourcentage.textContent = Math.round(nombreCompletees / casesMissions.length * 100);
}


function afficherMissionsEvenements() {
    const inscriptions = JSON.parse(
        localStorage.getItem(cleInscriptions) || "[]"
    );

    const idsInscrits = new Set(
        inscriptions.map(inscription => inscription.id)
    );

    // Remove events that are no longer registered
    for (let i = casesMissions.length - 1; i >= 0; i--) {
        const caseMission = casesMissions[i];

        if (
            caseMission.id.startsWith("evenement-") &&
            !idsInscrits.has(caseMission.id)
        ) {
            caseMission.closest("li").remove();
            casesMissions.splice(i, 1);
        }
    }

    const idsExistants = new Set(
        casesMissions.map(caseMission => caseMission.id)
    );

    // Add newly registered events
    for (const inscription of inscriptions) {
        if (idsExistants.has(inscription.id)) {
            continue;
        }

        const points = pointsEvenements[inscription.id] ?? 0;

        const ligne = document.createElement("li");
        const label = document.createElement("label");
        const caseMission = document.createElement("input");
        const titre = document.createElement("span");
        const recompense = document.createElement("span");

        caseMission.type = "checkbox";
        caseMission.id = inscription.id;
        caseMission.dataset.points = points;

        label.className = "mission_box";

        titre.className = "mission";
        titre.textContent = inscription.titre;

        recompense.className = "mission_points";
        recompense.textContent = points + " points";

        label.append(caseMission, titre, recompense);
        ligne.appendChild(label);
        listeMissions.appendChild(ligne);

        caseMission.addEventListener("change", enregistrerChangement);

        casesMissions.push(caseMission);
        idsExistants.add(inscription.id);
    }
}

function restaurerCasesMissions() {
    afficherMissionsEvenements();
    const historique = lireHistorique();

    for (const caseMission of casesMissions) {
        const id = identifiantMission(caseMission);
        caseMission.checked = historique.some(mission => mission.id === id);
    }

    mettreAJourDashboard();
}

function enregistrerChangement(event) {
    const caseMission = event.target;
    const id = identifiantMission(caseMission);
    let historique = lireHistorique();
    const dejaValidee = historique.some(mission => mission.id === id);

    if (caseMission.checked && !dejaValidee) {
        historique.unshift(creerMissionValidee(caseMission));
    }
    if (!caseMission.checked && dejaValidee) {
        historique = historique.filter(mission => mission.id !== id);
    }

    localStorage.setItem(cleHistorique, JSON.stringify(historique));
    mettreAJourDashboard();
}

// Au premier lancement, enregistrer les missions cochées dans la maquette.
if (localStorage.getItem(cleHistorique) === null) {
    const historique = [];

    for (const caseMission of casesMissions) {
        if (caseMission.checked) {
            historique.unshift(creerMissionValidee(caseMission));
        }
    }

    localStorage.setItem(cleHistorique, JSON.stringify(historique));
}

for (const caseMission of casesMissions) {
    caseMission.addEventListener("change", enregistrerChangement);
}

restaurerCasesMissions();
window.addEventListener("pageshow", restaurerCasesMissions);
window.addEventListener("storage", restaurerCasesMissions);
