document.addEventListener('DOMContentLoaded', function() {
    const phases = {
        "round-of-16": [
            { team1: "TBD", team2: "TBD", score1: 0, score2: 0, date: "" },
            { team1: "TBD", team2: "TBD", score1: 0, score2: 0, date: "" }
        ],
        "quarterfinals": [
            { team1: "TBD", team2: "TBD", score1: 0, score2: 0, date: "" }
        ],
        "semifinals": [
            { team1: "TBD", team2: "TBD", date: "" }
        ],
        "final": [
            { team1: "TBD", team2: "TBD", date: "" }
        ]
    };

    Object.keys(phases).forEach(phaseId => {
        const phase = document.querySelector(`.${phaseId} .matches`);
        
        phases[phaseId].forEach(match => {
            const matchEl = document.createElement('div');
            matchEl.className = 'match slide-up';
            
            const team1Class = match.score1 > match.score2 ? 'winner' : 
                              match.score1 < match.score2 ? 'loser' : '';
            const team2Class = match.score2 > match.score1 ? 'winner' : 
                              match.score2 < match.score1 ? 'loser' : '';
            
            matchEl.innerHTML = `
                <div class="match-team ${team1Class}">
                    <div class="team-name">
                        <img src="img/teams/${match.team1.toLowerCase().replace(' ', '-')}.png" 
                             alt="${match.team1}" class="team-logo-small">
                        <span>${match.team1}</span>
                    </div>
                    <span class="match-score">${match.score1 || ''}</span>
                </div>
                <div class="match-team ${team2Class}">
                    <div class="team-name">
                        <img src="img/teams/${match.team2.toLowerCase().replace(' ', '-')}.png" 
                             alt="${match.team2}" class="team-logo-small">
                        <span>${match.team2}</span>
                    </div>
                    <span class="match-score">${match.score2 || ''}</span>
                </div>
            `;
            
            phase.appendChild(matchEl);
        });
    });
});