//reservation routes
import express from 'express'
import db from '../db.js';


const reservationRoutes = express.Router();

//reserve a hike
//localhost:3001/api/reservations
reservationRoutes.post('/', async (req, res) => {
  const { user_id, schedule_id } = req.body;

  if (!user_id || !schedule_id) {
    return res.status(400).json({ message: "Missing user_id or schedule_id" });
  }

  try {
    // Check for existing reservation
    const existing = await db.query(
      `SELECT * FROM reservations WHERE user_id = $1 AND schedule_id = $2`,
      [user_id, schedule_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "You already reserved this hike." });
    }

    // Insert reservation
    const result = await db.query(
      `INSERT INTO reservations (user_id, schedule_id) VALUES ($1, $2) RETURNING *`,
      [user_id, schedule_id]
    );

    res.status(201).json({ reservation: result.rows[0] });
  } catch (error) {
    console.error(error);
    // Handle unique constraint error gracefully
    if (error.code === '23505') {
      return res.status(409).json({ message: "You already reserved this hike." });
    }
    res.status(500).json({ message: "Reservation failed" });
  }
});

//get user's reservations by userid
//localhost:3001/api/reservations/2
reservationRoutes.get('/:id',(req, res)=>{
    const userId = req.params.id;

    db.query(`SELECT r.id, r.user_id, s.*, h.name, h.location, h.image_url
    FROM hike_schedule s
    JOIN hike_details h ON h.id = s.hike_id JOIN reservations r
    ON s.id = r.schedule_id
    WHERE $1 = r.user_id AND s.date > CURRENT_DATE
    ORDER BY s.date ASC; `,[userId])
    .then((result)=> res.status(200).json(result.rows))
    .catch((error)=> res.status(500).json({message:"Failed to fetch reservations"}));
})

//get user's reservations
//localhost:3001/api/reservations/delete/2
reservationRoutes.delete('/delete/:id',(req, res)=>{
    const reservationId = req.params.id;

    db.query(`DELETE FROM reservations r WHERE $1 = r.id RETURNING *`,
        [reservationId])
        .catch((error)=> res.status(500).json({message:"Failed to delete reservations"}));
        }
    )

export default reservationRoutes;