const dbConnect = require('../../sqlite');
const createUsers = require('./createUsers');

async function migrations() {
    const migrationsSchema = [
        createUsers,
    ].join('');

    dbConnect().then(db => db.exec(migrationsSchema)).catch(error => console.log(error));
}

module.exports = migrations;