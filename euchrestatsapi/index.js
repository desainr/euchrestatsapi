require('dotenv').config();
const {ENTITIES} = require('./constants');
const PlayerService = require('./db/players.service');
const GameService = require('./db/games.service');
const TeamsService = require('./db/teams.service');
const firebase = require("firebase-admin");

firebase.initializeApp({
    credential: firebase.credential.cert({
        type: 'service_account',
        project_id: process.env['FIREBASE_PROJECT_ID'],
        private_key_id: process.env['FIREBASE_PRIVATE_KEY_ID'],
        private_key: process.env['FIREBASE_PRIVATE_KEY'],
        client_email: process.env['FIREBASE_CLIENT_EMAIL'],
        client_id: process.env['FIREBASE_CLIENT_ID'],
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env['FIREBASE_CLIENT_X509_CERT_URL'],
    }),
    databaseURL: "https://euchreapp-457bb.firebaseio.com"
});

const playerService = new PlayerService();
const teamsService = new TeamsService();
const gamesService = new GameService();

module.exports = async function (context, req) {
    const {entity} = context.bindingData;
    context.log(`Processing ${req.method} request for ${entity}`);

    if (entity === ENTITIES.GAMES) {
        if (req.method === 'GET') {
            const games = await gamesService.getAll();

            context.res = {
                status: 200,
                body: {
                    games,
                }
            }
        }

        if (req.method === 'POST') {
            const game = req.body;

            try {
                const updates = [];
                updates.push(...Object.keys(game.WinningTeam.Players).map(k => playerService.addWin(k)));
                updates.push(...Object.keys(game.LosingTeam.Players).map(k => playerService.addLoss(k)));
                updates.push(teamsService.addLoss(game.LosingTeam.UID), teamsService.addWin(game.WinningTeam.UID));
                updates.push(gamesService.addGame(game));

                const result = await Promise.all(updates);

                // gameUID is only thing returned
                const gameUID = result.filter(Boolean)[0];
                context.res = {
                    status: 200,
                    body: {
                        UID: gameUID,
                        ...req.body
                    }
                }
            } catch (ex) {
                context.log(ex);

                context.res = {
                    status: 500,
                    body: {
                        error: 'An error occurred while updating Firebase db.'
                    }
                }
            }
        }
    } else if (entity === ENTITIES.PLAYERS) {
        if (req.method === 'GET') {
            const players = await playerService.getAll();

            context.res = {
                status: 200,
                body: {
                    players,
                }
            }
        }

        if (req.method === 'POST') {
            context.res = {
                status: 404,
            }
        }
    } else if (entity === ENTITIES.TEAMS) {
        if (req.method === 'GET') {
            const teams = await teamsService.getAll();

            context.res = {
                status: 200,
                body: {
                    teams,
                }
            }
        }

        if (req.method === 'POST') {
            context.res = {
                status: 404,
            }
        }
    } else {
        context.res = {
            status: 404,
        }
    }
}
