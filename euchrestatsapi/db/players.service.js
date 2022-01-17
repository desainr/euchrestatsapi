const DatabaseService = require("./database.service");

class PlayersService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Players');
  }

  async updatePlayerRecord(player) {
    return this.ref.update({
      [`${player.UID}/Wins`]: player.Wins,
      [`${player.UID}/Losses`]: player.Losses,
    })
  }
}

module.exports = PlayersService;
