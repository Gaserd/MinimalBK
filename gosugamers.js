const cheerio = require('cheerio')
const nodeFetch = require('node-fetch')
const fs = require('fs')

async function getRatingAndSave(pages, game, pathSaveFile) {
    /*
    lol -> league of legends
    dota2 -> dota2
    counterstrike -> CS:GO
    overwatch -> Overwatch
    starcraft2 -> Starcraft2
    */
    let teams = []
    for (let i = 0; i < pages; i++) {
        await nodeFetch(`https://www.gosugamers.net/${game}/rankings/list?maxResults=50&page=` + i)
            .then(data => data.text())
            .then(data => {
                const $ = cheerio.load(data)
                $('.ranking-list li a').each(function (i, element) {
                    //j = 4 -> data - team name
                    //j = 5 -> children -> data elo ratings
                    const teamName = element.children[4].data.replace(/\s/g, '')
                    const eloRanking = element.children[5].children[0].data.replace(/\s/g, '');
                    teams.push({
                        teamName, eloRanking
                    })
                })
            })
    }
    try {
        fs.writeFileSync(pathSaveFile, JSON.stringify(teams))
        return true
    } catch(e) {
        console.log(e)
        return false
    }
}


module.exports = {
    getRatingAndSave
}