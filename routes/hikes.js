//hike routes
import express from 'express'
import db from '../db.js';


const hikeRoutes = express.Router();



//get upcoming scheduled hikes details //hikes join scheduledHikes
//localhost:3001/api/hikes/
hikeRoutes.get("/", (req, res) => {
    
  db.query(`
    SELECT s.*, h.name, h.location, h.description, h.difficulty, h.image_url
    FROM hike_schedule s
    JOIN hike_details h ON h.id = s.hike_id 
    WHERE s.date > CURRENT_DATE
    ORDER BY s.date ASC;
  `)
    .then(result => res.json(result.rows))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch hikes" });
    });
});

//get a hike details by id
//localhost:3001/api/hikes/:id
hikeRoutes.get("/:id", (req, res) => {

  db.query(`
    SELECT s.*, h.name, h.location, h.description, h.difficulty, h.image_url
    FROM hike_schedule s
    JOIN hike_details h ON h.id = s.hike_id
    WHERE s.id = $1;
  `, [req.params.id])
    .then(result => {
      if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(result.rows[0]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch hike detail" });
    });
});







export default hikeRoutes;



