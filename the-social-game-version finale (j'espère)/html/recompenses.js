const pointsEvenements = {
    "evenement-lancement": 5,
    "evenement-photographie": 4,
    "evenement-meetup": 6,
    "evenement-jeux": 5,
};

function lirePointsMission(mission) {
    // Les premières inscriptions avaient été enregistrées avec 0 point.
    if (mission.points === 0 && mission.id.startsWith("evenement-")) {
        return pointsEvenements[mission.id] ?? 0;
    }
    return mission.points;
}
