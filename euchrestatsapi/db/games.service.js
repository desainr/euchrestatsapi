const DatabaseService = require("./database.service");

class GamesService extends DatabaseService {
  constructor(props) {
    super(props);
    this.ref = this.database.ref('Games');
  }

  async addGame(game) {
    const newRef = await this.ref.push(game)

    return newRef.key;
  }
}

module.exports = GamesService;
