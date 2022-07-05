const { getRatingAndSave } = require('../gosugamers')

async function saveRatings() {
    console.log('sync GosuGamers + ratings ' + new Date())
    await getRatingAndSave(10, 'dota2', './dotaratings.json')
    await getRatingAndSave(10, 'counterstrike', './csgoratings.json')
    console.log('Done ' + new Date())
}

module.exports = {
    saveRatings : saveRatings
}