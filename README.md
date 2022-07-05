# MinimalBK
Value betting with Azuro Protocol

## Info

This project is built to introduce the Azuuro Protocol SDK and show some of its features.
If you are into betting, then you know about the presence of ELO rating among the teams, based on which you can build a chance of winning over this or that team.
This project is a combination of odds from Azuro (decentralized protocol) and ELO rating logic.

## How start
`npm install` - install packages

`cd cron-workers && node cron.js` - start sync ELO ratings and check value bets

`node index.js` - start server for view value betts and open http://localhost:8000

## Ideas for improvement

- you could add a smarter way to handle money in bets (it's very stupid now)
- you can add UI with wallet connection in metamask and subsequent bets
- other betting markets could be added, such as Handicap +1.5 based on ELO rating, this is good to see