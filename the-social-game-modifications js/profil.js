const totalXP = document.getElementById("total-xp");
const missionsMois = document.getElementById("missions-mois");
const totalMissions = document.getElementById("total-missions");
const missionsRecentes = document.getElementById("missions-recentes");
const aucuneMission = document.getElementById("aucune-mission");
const cleHistorique = "the-social-game-missions";
const xpParPoint = 10;
let moisAffiche;

function identifierMois(date) {
    return date.getFullYear() + "-" + date.getMonth();
}

function mettreAJourProfil() {
    const historique = JSON.parse(localStorage.getItem(cleHistorique) || "[]");
    moisAffiche = identifierMois(new Date());
    let totalPoints = 0;
    let pointsCeMois = 0;
    let nombreCeMois = 0;

    missionsRecentes.textContent = "";

    for (const mission of historique) {
        const points = lirePointsMission(mission);
        totalPoints += points;

        const dateMission = new Date(mission.date);
        if (identifierMois(dateMission) === moisAffiche) {
            nombreCeMois += 1;
            pointsCeMois += points;
        }

        const ligne = document.createElement("li");
        ligne.textContent = mission.nom;
        missionsRecentes.appendChild(ligne);
    }

    const xp = totalPoints * xpParPoint;
    totalXP.textContent = xp;
    document.getElementById("total-points").textContent = totalPoints;
    document.getElementById("points-mois").textContent = pointsCeMois;
    document.getElementById("xp-mois").textContent = pointsCeMois * xpParPoint;

    let niveau = 1;
    let xpDansNiveau = xp;
    let xpParNiveau = 100;
    // Retirer le coût de chaque niveau déjà franchi.
    while (xpDansNiveau >= xpParNiveau) {
        xpDansNiveau -= xpParNiveau;
        niveau += 1;
        xpParNiveau += 100;
    }
    const barreNiveau = document.getElementById("progression-niveau");
    document.getElementById("niveau").textContent = niveau;
    document.getElementById("xp-niveau").textContent = xpDansNiveau;
    document.getElementById("xp-palier").textContent = xpParNiveau;
    barreNiveau.max = xpParNiveau;
    barreNiveau.value = xpDansNiveau;
    document.getElementById("xp-restants").textContent = xpParNiveau - xpDansNiveau;

    missionsMois.textContent = nombreCeMois;
    totalMissions.textContent = historique.length;
    aucuneMission.hidden = historique.length > 0;
}

function verifierChangementDeMois() {
    if (identifierMois(new Date()) !== moisAffiche) {
        mettreAJourProfil();
    }
}

mettreAJourProfil();
window.addEventListener("pageshow", mettreAJourProfil);
window.addEventListener("storage", mettreAJourProfil);
document.addEventListener("visibilitychange", verifierChangementDeMois);
setInterval(verifierChangementDeMois, 1000);
