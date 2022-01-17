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
    context.log('JavaScript HTTP trigger function processed a request.');
    const {entity} = context.bindingData;

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
            const key = await gamesService.addGame(req.body);

            context.res = {
                status: 200,
                body: {
                    UID: key,
                    ...req.body
                }
            }
        }

        if (req.method === 'PUT') {
            context.res = {
                status: 404,
            }
        }
    }

    if (entity === ENTITIES.PLAYERS) {
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

        if (req.method === 'PUT') {
            await playerService.updatePlayerRecord(req.body);
            context.res = {
                status: 204,
            }
        }
    }

    if (entity === ENTITIES.TEAMS) {
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

        if (req.method === 'PUT') {
            await teamsService.updateTeamRecord(req.body);
            context.res = {
                status: 204,
            }
        }
    }

    context.res = {
        status: 404,
    }
}
