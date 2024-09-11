// Llista de jugadors disponibles
const playerList = [
    "Raul", "Aleix", "Miki", "Ian", "Murguins", "Castela", "Olba", "Juancho",
    "Lucas", "Mariano", "Conselleri", "Carles", "Rober", "Depa", "Alex S.",
    "Uri", "Kim", "Gero", "Jorge", "Francesco"
];

// Emmagatzematge d'equips
let teams = JSON.parse(localStorage.getItem('teams')) || {};

// Funció per obrir una pestanya i amagar les altres
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'classification') {
        updateRankings();
    }
}

// Funció per inicialitzar els desplegables de jugadors per a la formació d'equips
function initializeTeams() {
    loadPlayerOptions('A');
    loadPlayerOptions('B');
    loadPlayerOptions('C');
    loadPlayerOptions('D');
    loadSavedTeams();
}

// Funció per carregar les opcions de jugadors en els desplegables
function loadPlayerOptions(team) {
    const selects = document.querySelectorAll(`#equip${team} .player-select`);
    selects.forEach(select => {
        select.innerHTML = "";
        playerList.forEach(player => {
            const option = document.createElement("option");
            option.value = player;
            option.text = player;
            select.appendChild(option);
        });
    });
}

// Funció per carregar equips guardats al localStorage
function loadSavedTeams() {
    Object.keys(teams).forEach(team => {
        const teamData = teams[team];
        if (teamData) {
            document.getElementById(`summary${team}`).innerHTML = `
                <p><strong>Capità:</strong> ${teamData.captain}</p>
                <p><strong>Jugador 1:</strong> ${teamData.players[0]}</p>
                <p><strong>Jugador 2:</strong> ${teamData.players[1]}</p>
                <p><strong>Jugador 3:</strong> ${teamData.players[2]}</p>
                <p><strong>Jugador 4:</strong> ${teamData.players[3]}</p>
            `;
        }
    });
}

// Funció per desar un equip al localStorage
function saveTeam(team) {
    const captain = document.getElementById(`captain${team}`).value;
    const player1 = document.getElementById(`player1${team}`).value;
    const player2 = document.getElementById(`player2${team}`).value;
    const player3 = document.getElementById(`player3${team}`).value;
    const player4 = document.getElementById(`player4${team}`).value;

    teams[team] = { captain, players: [player1, player2, player3, player4] };
    localStorage.setItem('teams', JSON.stringify(teams));

    document.getElementById(`summary${team}`).innerHTML = `
        <p><strong>Capità:</strong> ${captain}</p>
        <p><strong>Jugador 1:</strong> ${player1}</p>
        <p><strong>Jugador 2:</strong> ${player2}</p>
        <p><strong>Jugador 3:</strong> ${player3}</p>
        <p><strong>Jugador 4:</strong> ${player4}</p>
    `;
}

// Funció per eliminar un equip
function deleteTeam(team) {
    delete teams[team];
    localStorage.setItem('teams', JSON.stringify(teams));
    document.getElementById(`summary${team}`).innerHTML = "";
}

// Funció per carregar els equips als desplegables de la pestanya d'introducció de resultats
function loadTeamsForResults() {
    const team1Select = document.getElementById('team1');
    const team2Select = document.getElementById('team2');

    team1Select.innerHTML = '<option value="">Selecciona un equip</option>';
    team2Select.innerHTML = '<option value="">Selecciona un equip</option>';

    if (Object.keys(teams).length === 0) {
        console.log('No hi ha equips guardats.');
        return;
    }

    Object.keys(teams).forEach(team => {
        const option1 = document.createElement('option');
        option1.value = team;
        option1.text = `Equip ${team}`;
        team1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = team;
        option2.text = `Equip ${team}`;
        team2Select.appendChild(option2);
    });
}

// Funció per carregar jugadors d'un equip seleccionat als desplegables de jugadors
function loadPlayersForTeam(team, playerSelect1, playerSelect2) {
    const teamData = teams[team];
    if (teamData) {
        playerSelect1.innerHTML = '';
        playerSelect2.innerHTML = '';

        // Afegim el capità als jugadors disponibles
        const allPlayers = [teamData.captain, ...teamData.players]; // Capità + jugadors

        allPlayers.forEach(player => {
            const option1 = document.createElement('option');
            option1.value = player;
            option1.text = player;
            playerSelect1.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = player;
            option2.text = player;
            playerSelect2.appendChild(option2);
        });
    }
}
document.getElementById('team1').addEventListener('change', function () {
    const team1 = this.value;
    loadPlayersForTeam(team1, document.getElementById('player1_team1'), document.getElementById('player2_team1'));
});

document.getElementById('team2').addEventListener('change', function () {
    const team2 = this.value;
    loadPlayersForTeam(team2, document.getElementById('player1_team2'), document.getElementById('player2_team2'));
});

// Funció per desar un resultat de partit i actualitzar localStorage
let matchResults = JSON.parse(localStorage.getItem('matchResults')) || [];

function saveResult() {
    const team1 = document.getElementById('team1').value;
    const team2 = document.getElementById('team2').value;
    const player1_team1 = document.getElementById('player1_team1').value;
    const player2_team1 = document.getElementById('player2_team1').value;
    const player1_team2 = document.getElementById('player1_team2').value;
    const player2_team2 = document.getElementById('player2_team2').value;

    const set1_team1 = parseInt(document.getElementById('set1_team1').value);
    const set1_team2 = parseInt(document.getElementById('set1_team2').value);
    const set2_team1 = parseInt(document.getElementById('set2_team1').value);
    const set2_team2 = parseInt(document.getElementById('set2_team2').value);
    const set3_team1 = parseInt(document.getElementById('set3_team1').value) || 0;
    const set3_team2 = parseInt(document.getElementById('set3_team2').value) || 0;

    // Determinem l'equip guanyador
    let setsWonTeam1 = 0;
    let setsWonTeam2 = 0;

    if (set1_team1 > set1_team2) setsWonTeam1++;
    else setsWonTeam2++;

    if (set2_team1 > set2_team2) setsWonTeam1++;
    else setsWonTeam2++;

    if (set3_team1 !== 0 || set3_team2 !== 0) {
        if (set3_team1 > set3_team2) setsWonTeam1++;
        else setsWonTeam2++;
    }

    let winner;
    if (setsWonTeam1 >= 2) {
        winner = team1;
    } else {
        winner = team2;
    }

    const result = {
        team1,
        team2,
        player1_team1,
        player2_team1,
        player1_team2,
        player2_team2,
        set1_team1,
        set1_team2,
        set2_team1,
        set2_team2,
        set3_team1,
        set3_team2,
        winner
    };

    matchResults.push(result);
    localStorage.setItem('matchResults', JSON.stringify(matchResults));
    displayMatchResults();
}

function displayMatchResults() {
    const resultsTable = document.querySelector("#resultsTable tbody");
    resultsTable.innerHTML = "";

    matchResults.forEach((result, index) => {
        const row = `
            <tr>
                <td>${result.team1} (${result.player1_team1}, ${result.player2_team1}) vs ${result.team2} (${result.player1_team2}, ${result.player2_team2})</td>
                <td>${result.set1_team1}-${result.set1_team2}, ${result.set2_team1}-${result.set2_team2}${result.set3_team1 || result.set3_team2 ? `, ${result.set3_team1}-${result.set3_team2}` : ''}</td>
                <td>${result.winner}</td>
                <td><button onclick="deleteResult(${index})">Eliminar</button></td>
            </tr>
        `;
        resultsTable.innerHTML += row;
    });
}

function deleteResult(index) {
    matchResults.splice(index, 1);
    localStorage.setItem('matchResults', JSON.stringify(matchResults));
    displayMatchResults();
}

let teamsRanking = {};
let playersRanking = {};


function updateRankings() {
    if (matchResults.length === 0) {
        console.log("No hi ha resultats per mostrar en la classificació.");
        return;
    }

    teamsRanking = {
        A: { name: 'Equip A', points: 0, played: 0, won: 0, lost: 0, gamesFor: 0, gamesAgainst: 0 },
        B: { name: 'Equip B', points: 0, played: 0, won: 0, lost: 0, gamesFor: 0, gamesAgainst: 0 },
        C: { name: 'Equip C', points: 0, played: 0, won: 0, lost: 0, gamesFor: 0, gamesAgainst: 0 },
        D: { name: 'Equip D', points: 0, played: 0, won: 0, lost: 0, gamesFor: 0, gamesAgainst: 0 }
    };

    playersRanking = {};
    playerList.forEach(player => {
        playersRanking[player] = { name: player, points: 0, played: 0, won: 0, lost: 0, gamesFor: 0, gamesAgainst: 0 };
    });

    matchResults.forEach(result => {
        const { team1, team2, set1_team1, set1_team2, set2_team1, set2_team2, set3_team1, set3_team2 } = result;

        const gamesForTeam1 = set1_team1 + set2_team1 + (set3_team1 || 0);
        const gamesAgainstTeam1 = set1_team2 + set2_team2 + (set3_team2 || 0);
        const gamesForTeam2 = set1_team2 + set2_team2 + (set3_team2 || 0);
        const gamesAgainstTeam2 = set1_team1 + set2_team1 + (set3_team1 || 0);

        updateTeamStats(teamsRanking[team1], teamsRanking[team2], gamesForTeam1, gamesAgainstTeam1, result.winner);
        updatePlayerStats(playersRanking[result.player1_team1], playersRanking[result.player2_team1], playersRanking[result.player1_team2], playersRanking[result.player2_team2], gamesForTeam1, gamesAgainstTeam1, result.winner);
    });

    displayTeamRanking(teamsRanking);
    displayPlayerRanking(playersRanking);
}

function updateTeamStats(team1, team2, gamesForTeam1, gamesAgainstTeam1, winner) {
    team1.played += 1;
    team2.played += 1;

    team1.gamesFor += gamesForTeam1;
    team1.gamesAgainst += gamesAgainstTeam1;
    team2.gamesFor += gamesAgainstTeam1;
    team2.gamesAgainst += gamesForTeam1;

    // Comprovar el guanyador utilitzant 'winner' tal com es guarda als resultats
    if (winner === 'A' && team1.name === 'Equip A') {
        team1.won += 1;
        team1.points += 3;  // Punts per l'equip guanyador
        team2.lost += 1;
    } else if (winner === 'B' && team2.name === 'Equip B') {
        team2.won += 1;
        team2.points += 3;  // Punts per l'equip guanyador
        team1.lost += 1;
    } else if (winner === 'C' && team1.name === 'Equip C') {
        team1.won += 1;
        team1.points += 3;
        team2.lost += 1;
    } else if (winner === 'D' && team2.name === 'Equip D') {
        team2.won += 1;
        team2.points += 3;
        team1.lost += 1;
    }
}


function updatePlayerStats(player1_team1, player2_team1, player1_team2, player2_team2, gamesForTeam1, gamesAgainstTeam1, winner, team1, team2) {
    [player1_team1, player2_team1].forEach(player => {
        player.played += 1;
        player.gamesFor += gamesForTeam1;
        player.gamesAgainst += gamesAgainstTeam1;

        if (winner === team1) {
            player.won += 1;
            player.points += 3;
        } else {
            player.lost += 1;
        }
    });

    [player1_team2, player2_team2].forEach(player => {
        player.played += 1;
        player.gamesFor += gamesAgainstTeam1;
        player.gamesAgainst += gamesForTeam1;

        if (winner === team2) {
            player.won += 1;
            player.points += 3;
        } else {
            player.lost += 1;
        }
    });
}

function displayTeamRanking(teamsRanking) {
    const teamRanking = Object.values(teamsRanking).sort((a, b) => b.points - a.points);
    const tableBody = document.querySelector('#teamRanking tbody');
    tableBody.innerHTML = '';

    teamRanking.forEach(team => {
        const row = `<tr>
            <td>${team.name}</td>
            <td>${team.points}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.lost}</td>
            <td>${team.gamesFor}</td>
            <td>${team.gamesAgainst}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function displayPlayerRanking(playersRanking) {
    // Ordenem per punts i després per jocs a favor
    const playerRanking = Object.values(playersRanking).sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;  // Prioritza la ordenació per punts
        } else {
            return b.gamesFor - a.gamesFor;  // Si tenen els mateixos punts, ordena per jocs a favor
        }
    });

    const tableBody = document.querySelector('#playerRanking tbody');
    tableBody.innerHTML = '';

    playerRanking.forEach(player => {
        const row = `<tr>
            <td>${player.name}</td>
            <td>${player.points}</td>
            <td>${player.played}</td>
            <td>${player.won}</td>
            <td>${player.lost}</td>
            <td>${player.gamesFor}</td>
            <td>${player.gamesAgainst}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Funció per generar l'HTML de la classificació
function exportClassification() {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="ca">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Classificació del Torneig</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #00796b; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f0f8ff; color: #00796b; }
        </style>
    </head>
    <body>
        <h1>Classificació del Torneig</h1>
        
        <h2>Classificació d'Equips</h2>
        <table>
            <thead>
                <tr>
                    <th>Equip</th>
                    <th>Punts</th>
                    <th>Jugats</th>
                    <th>Guanyats</th>
                    <th>Perduts</th>
                    <th>Jocs a favor</th>
                    <th>Jocs en contra</th>
                </tr>
            </thead>
            <tbody>`;

    // Afegeix les files de la classificació d'equips
    Object.values(teamsRanking).forEach(team => {
        htmlContent += `
            <tr>
                <td>${team.name}</td>
                <td>${team.points}</td>
                <td>${team.played}</td>
                <td>${team.won}</td>
                <td>${team.lost}</td>
                <td>${team.gamesFor}</td>
                <td>${team.gamesAgainst}</td>
            </tr>`;
    });

    htmlContent += `
            </tbody>
        </table>
        
        <h2>Classificació de Jugadors</h2>
        <table>
            <thead>
                <tr>
                    <th>Jugador</th>
                    <th>Punts</th>
                    <th>Jugats</th>
                    <th>Guanyats</th>
                    <th>Perduts</th>
                    <th>Jocs a favor</th>
                    <th>Jocs en contra</th>
                </tr>
            </thead>
            <tbody>`;

    // Afegeix les files de la classificació de jugadors
    Object.values(playersRanking).forEach(player => {
        htmlContent += `
            <tr>
                <td>${player.name}</td>
                <td>${player.points}</td>
                <td>${player.played}</td>
                <td>${player.won}</td>
                <td>${player.lost}</td>
                <td>${player.gamesFor}</td>
                <td>${player.gamesAgainst}</td>
            </tr>`;
    });

    htmlContent += `
            </tbody>
        </table>
    </body>
    </html>`;

    // Crear un blob i descarregar-lo com un fitxer HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'classificacio_torneig.html';
    link.click();
    URL.revokeObjectURL(url);
}





window.onload = function() {
    initializeTeams();
    loadTeamsForResults();
    displayMatchResults();
    updateRankings();
};
