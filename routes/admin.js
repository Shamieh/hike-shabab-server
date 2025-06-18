// routes/adminRoutes.js
import express from 'express';
import db from '../db.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRoutes = express.Router();

//localhost:3001/api/admin/stats
adminRoutes.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalHikes = await db.query('SELECT COUNT(*) FROM hikes');
        const scheduledHikes = await db.query('SELECT COUNT(*) FROM hike_schedule WHERE date >= CURRENT_DATE');
    const totalReservations = await db.query('SELECT COUNT(*) FROM reservations');
    const upcomingHikers = await db.query(`
      SELECT COUNT(DISTINCT user_id)
      FROM reservations r
      JOIN hike_schedule s ON s.id = r.schedule_id
      WHERE s.date >= CURRENT_DATE
      `);
      
      res.json({
      totalHikes: parseInt(totalHikes.rows[0].count),
      scheduledHikes: parseInt(scheduledHikes.rows[0].count),
      totalReservations: parseInt(totalReservations.rows[0].count),
      upcomingHikers: parseInt(upcomingHikers.rows[0].count),
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

//localhost:3001/api/admin/
//add a hike
adminRoutes.post('/', adminAuth, async (req, res) => {
  const { hike_id, date, time, capacity } = req.body;
  if (!hike_id || !date || !time || !capacity)
    return res.status(400).json({ message: 'Missing required fields' });

  try {
    const result = await db.query(
      `INSERT INTO hike_schedule (hike_id, date, time, capacity) VALUES ($1, $2, $3, $4) RETURNING *`,
      [hike_id, date, time, capacity]
    );
    res.status(201).json({ schedule: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to schedule hike' });
  }
});


//localhost:3001/api/admin/
//view all scheduled hikes
adminRoutes.get('/hike-schedule/all', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT hs.id, hs.date, hs.time, hs.capacity, h.name AS hike_name
      FROM hike_schedule hs
      JOIN hikes h ON hs.hike_id = h.id
      ORDER BY hs.date
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch hikes' });
  }
});

//localhost:3001/api/admin/2
//update hike
adminRoutes.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { date, time, capacity } = req.body;

  try {
    const result = await db.query(`
      UPDATE hike_schedule 
      SET date = $1, time = $2, capacity = $3
      WHERE id = $4 AND date >= CURRENT_DATE
      RETURNING *`,
      [date, time, capacity, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Schedule not found or past' });

    res.json({ updated: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update hike' });
  }
});

//localhost:3001/api/admin/2
//delete hike
adminRoutes.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      DELETE FROM hike_schedule
      WHERE id = $1 AND date >= CURRENT_DATE
      RETURNING *`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Schedule not found or past' });

    res.json({ deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete hike' });
  }
});

//localhost:3001/api/admin/scheduled
//get upcoming hikes
adminRoutes.get('/hike-schedule/:id/reservations', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT u.username, u.email
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.schedule_id = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
});

export default adminRoutes;

