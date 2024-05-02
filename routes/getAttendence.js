const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const uri = 'mongodb+srv://garudahalli000:lms_iot@cluster0.djwr8tc.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function fetchAttendance(req, res) {
    try {
        // Connect the client to the server
        await client.connect();

        // Establish and verify connection
        console.log('Connected to the database');

        // Select the database and collection
        const database = client.db('test');
        const collection = database.collection('attendance');

        // Query the database to fetch attendance entries
        const attendanceEntries = await collection.find({}).toArray();

        // Send the fetched attendance entries as a JSON response
        res.json(attendanceEntries);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'An error occurred while fetching attendance' });
    }
}

router.get('/viewAllStudents', fetchAttendance);

router.put('/updateAttendance/:id', async (req, res) => {
  const { id } = req.params;
  const { isPresent } = req.body.isPresent;

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('attendance');

    // Update attendance in the database
    const result = await collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { isPresent } }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: 'Attendance updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Attendance not found' });
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ success: false, message: 'Failed to update attendance' });
  }
});



async function fetchStudentAttendance(req, res) {
  try {
      // Connect the client to the server
      await client.connect();

      // Extract student's enrollment number from request parameters
      const { enrollmentNo } = req.params;

      // Establish and verify connection
      console.log('Connected to the database');

      // Select the database and collection
      const database = client.db('test');
      const collection = database.collection('attendance');

      // Query the database to fetch attendance entries for the specified student
      const studentAttendance = await collection.find({ enrollmentNumber: enrollmentNo }).toArray();
      // Send the fetched attendance entries as a JSON response
      res.json(studentAttendance);
  } catch (error) {
      // If an error occurs, send an error response
      console.error('Error fetching student attendance:', error);
      res.status(500).json({ error: 'An error occurred while fetching student attendance' });
  }
}

router.get('/viewStudentAttendance/:enrollmentNo', fetchStudentAttendance);


module.exports = router;

