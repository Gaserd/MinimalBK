const { getGames } = require('./saveValueBets')
const { saveRatings } = require('./saveRatings')

setInterval(async function() {
    console.log('running a task')
    await saveRatings()
    await getGames()
}, 300000)

