const express = require('express');
const router = express.Router();

const pgFavsongs = require('../models/favsongsModel')
// const db = require('../models/favsongsModel')

router.get('/:albumID', (requ, resp, next) => {
  // Read parameter
  const id = requ.params.albumID;
  // Get fav songs for this amlbum or 'empty' is there is no row for this song
  const sql =  `SELECT CASE
                  WHEN EXISTS(SELECT favsongs.songs FROM favsongs WHERE favsongs.id = ${id}) THEN
                    (SELECT favsongs.songs FROM favsongs WHERE favsongs.id = ${id})
                  ELSE
                    ''
                END AS songs;`;
  // Connect to database and run SQL
  pgFavsongs.connect((err, client, release) => {
    if (err) return console.error('Error acquiring client', err.stack);
    client.query(sql, (err, result) => {
      release();
      if (err) return console.error('Error executing query', err.stack);
      // Send response
      resp.status(200).json({
        id: id,
        songs: `${result.rows[0].songs}`,
        error: err
      });
    });
  });  
});

router.post('/:albumID', (req, res, next) => {
  // Read parameters
  const id = req.params.albumID;
  const songs = req.query.songs;

  // Create row if it does not already exist, then update the value. In case it already exists, it will just update the value
  const sql =  `INSERT INTO favsongs(id, songs)
                  SELECT ${id}, '${songs}'
                WHERE
                  NOT EXISTS(SELECT id FROM favsongs WHERE id = ${id});
                UPDATE favsongs SET songs = '${songs}' WHERE id = ${id};`;
  // Connect to database and run SQL
  pgFavsongs.connect((err, client, release) => {
    if (err) return console.error('Error acquiring client', err.stack);
    client.query(sql, (err, result) => {
      release();
      if (err) return console.error('Error executing query', err.stack);
      // Send response
      res.status(201).json({
        id: id,
        songs: songs,
        error: err
      });
    });
  });
});

module.exports = router;