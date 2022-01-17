const DatabaseService = require("./database.service");

class TeamsService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Teams');
  }

  async updateTeamRecord(team) {
    return this.ref.child(team.UID).set({
      Wins: team.Wins,
      Losses: team.Losses,
    })
  }
}

module.exports = TeamsService;
