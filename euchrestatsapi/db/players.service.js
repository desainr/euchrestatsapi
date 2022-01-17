const DatabaseService = require("./database.service");

class PlayersService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Players');
  }

  async updatePlayerRecord(player) {
    return this.ref.child(player.UID).set({
      Wins: player.Wins,
      Losses: player.Losses,
    })
  }
}

module.exports = PlayersService;
