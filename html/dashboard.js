const casesMissions = document.querySelectorAll('#liste-missions input[type="checkbox"]');
const pointsSemaine = document.getElementById("points-semaine");
const missionsCompletees = document.getElementById("missions-completees");
const missionsRestantes = document.getElementById("missions-restantes");
const progression = document.getElementById("progression");
const pourcentage = document.getElementById("pourcentage");

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
    missionsRestantes.textContent = casesMissions.length - nombreCompletees;
    progression.value = nombreCompletees;
    pourcentage.textContent = Math.round(nombreCompletees / casesMissions.length * 100);
}

for (const caseMission of casesMissions) {
    caseMission.addEventListener("change", mettreAJourDashboard);
}

mettreAJourDashboard();
