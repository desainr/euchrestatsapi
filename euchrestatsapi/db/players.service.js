const DatabaseService = require("./database.service");
const firebase = require("firebase-admin");

class PlayersService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Players');
  }

  async addLoss(playerUID) {
    return this.ref.update({
      [`${playerUID}/Losses`]: firebase.database.ServerValue.increment(1),
    })
  }

  async addWin(playerUID) {
    return this.ref.update({
      [`${playerUID}/Wins`]: firebase.database.ServerValue.increment(1),
    })
  }
}

module.exports = PlayersService;
