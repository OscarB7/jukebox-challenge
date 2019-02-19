const { Pool } = require('pg');
const pg = new Pool({
    user: "postgres", 
    password: 'password',
    port: 5432,
    database: 'postgresDB'
});




// const pgp = require('pg-promise')({
//     // Initialization Options
// });

// // Preparing the connection details:
// const cn = 'postgres://postgres:pspa%%wd4rails@host:5432/postgres';

// // Creating a new database instance from the connection details:
// const db = pgp(cn);

// // Exporting the database object for shared use:
// module.exports = db;












// module.exports = {
//   query: function (text, values, cb) {
//     pg.connect(function (err, client, done) {
//       client.query(text, values, function (err, result) {
//         done();
//         cb(err, result);
//       })
//     });
//   }
// }


module.exports = pg;