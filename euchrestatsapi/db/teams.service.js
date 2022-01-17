const DatabaseService = require("./database.service");

class TeamsService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Teams');
  }

  async updateTeamRecord(team) {
    return this.ref.update({
      [`${team.UID}/Wins`]: team.Wins,
      [`${team.UID}/Losses`]: team.Losses,
    })
  }
}

module.exports = TeamsService;
