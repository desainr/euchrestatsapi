const firebase = require('firebase-admin')

class DatabaseService {
  database;
  ref;

  constructor() {
    this.database = firebase.database();
  }

  getAll() {
    return this.ref.once('value').then((snapshot) => snapshot.val());
  }
}

module.exports = DatabaseService;
