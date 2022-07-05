const azuro = require('@azuro-protocol/sdk')
const fs = require('fs')
const config = require('../config')

function searchTeam(name, teams) {
    return teams.filter(
        team => team.teamName.toUpperCase().replace(/\s/g, '').indexOf(name.toUpperCase().replace(/\s/g, '')) !== -1 ||
        team.teamName.toUpperCase().replace(/\s/g, '').indexOf(name.toUpperCase().replace('GAMING', '').replace(/\s/g, '')) !== -1
    )
}

function formatNumber(num) {
    return Math.round(num * 100) / 100
}

function getCashNumber(coefficient) {
    let cash = 0
    if (coefficient < 1.5) {
        cash = 150
    } else if (coefficient >= 1.5 && coefficient <= 2.5) {
        cash = 100
    } else if (coefficient > 2.5) {
        cash = 85
    }
    return cash
}

function getEsportMatchesOnlyWinLose(matches) {

    let returnMatches = []

    for (let i = 0; i < matches.length; i++) {
        let match = matches[i]

        if (match.league.indexOf('Dota 2') !== -1 || match.league.indexOf('Counter-Strike') !== -1) {

            if (match.conditions[0].odds[0].outcomeId == 32 || match.conditions[0].odds[0].outcomeId == 34) {
                let m = {
                    team1: match.participants[0].name,
                    team2: match.participants[1].name,
                    odd1: match.conditions[0].odds[0].value,
                    odd2: match.conditions[0].odds[1].value,
                    type: match.league.indexOf('Dota 2') !== -1 ? 'dota2' : 'counterstrike',
                    date: match.startsAt
                }
                returnMatches.push(m)
            }
        }

    }
    return returnMatches
}

async function getValueMatches(data) {
    
    const teamsDOTA = JSON.parse(fs.readFileSync('./dotaratings.json', 'utf-8'))
    const teamsCSGO = JSON.parse(fs.readFileSync('./csgoratings.json', 'utf-8'))

    let array = []

    for (let i = 0; i < data.length; i++) {
        const match = data[i]
        const home = match.team1
        const away = match.team2
        const date = match.date

        let eloRatingHome = match.type == 'dota2' ? searchTeam(home, teamsDOTA) : searchTeam(home, teamsCSGO)
        let eloRatingAway = match.type == 'dota2' ? searchTeam(away, teamsDOTA) : searchTeam(away, teamsCSGO)

        if (eloRatingHome.length > 0 && eloRatingAway.length > 0) {
            eloRatingHome = eloRatingHome[0].eloRanking
            eloRatingAway = eloRatingAway[0].eloRanking

            const dr = eloRatingHome - eloRatingAway
            const W1 = 1 / (Math.pow(10, (-dr / 400)) + 1)
            const W2 = 1 - W1

            const homeOdd = match.odd1
            const awayOdd = match.odd2
            const margin = (((1 / homeOdd) + (1 / awayOdd)) - 1) / 2

            const calcHomeOdd = formatNumber(1 / (W1 + margin))
            const calcAwayOdd = formatNumber(1 / (W2 + margin))

            const valueHome = formatNumber(homeOdd * (1 / calcHomeOdd))
            const valueAway = formatNumber(awayOdd * (1 / calcAwayOdd))

            array.push({
                date,
                home,
                away,
                homeOdd,
                awayOdd,
                calcHomeOdd,
                calcAwayOdd,
                valueHome,
                valueAway,
                bet: valueHome > 1 ? home : valueAway > 1 ? away : '',
                cash: valueHome > 1 ? getCashNumber(homeOdd) : valueAway > 1 ? getCashNumber(awayOdd) : '',
                info : match
            })
        }
    }

    return array
}

async function getGames() {

    azuro.setSelectedChainId(config.chainId);

    azuro.setContractAddresses({
        core: config.core,
        lp: config.lp,
        bet: config.bet,
        token: config.token,
    });

    azuro.configure({
        rpcUrl: config.rpcUrl,
        ipfsGateway: config.ipfsGateway,
    })

    

    await azuro.fetchGames({ 
        filters : {
            resolved: false,
            canceled: false,
        }
    }).then(async res => {

        console.log('Get Azuro matches')
        let matches = getEsportMatchesOnlyWinLose(res)
        let returnValues = await getValueMatches(matches)
        if (returnValues.length > 0)
            fs.writeFileSync('res.json', JSON.stringify(returnValues, null, 2))
    }).catch(e => console.log(e))
}

module.exports = { 
    getGames : getGames
}
