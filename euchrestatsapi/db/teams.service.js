const DatabaseService = require("./database.service");
const firebase = require("firebase-admin");

class TeamsService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Teams');
  }

  async addLoss(teamUID) {
    return this.ref.update({
      [`${teamUID}/Losses`]: firebase.database.ServerValue.increment(1),
    })
  }

  async addWin(teamUID) {
    return this.ref.update({
      [`${teamUID}/Wins`]: firebase.database.ServerValue.increment(1),
    })
  }
}

module.exports = TeamsService;
