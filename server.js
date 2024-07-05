/**
 * Author: Manuel Millefiori
 * Date: 2024-06-27
 * TODO:
 * 1) Gestire meglio le risposte delle richieste
 * 2) Filtrare tutte le richieste
 * 3) Fix Date Corso
 */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

// Configuring CORS options
var corsOptions = {
   origin: process.env.CORS_URI,
   optionsSuccessStatus: 200
}

// Midlleware for JSON parsing
app.use(express.json());

// Middleware for CORS
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.DB_URI).then(() => {
   console.log("Connected to MongoDB");
}).catch(err => {
   console.error("Could not connect to MongoDB", err);
});

// Define the member schema
const memberSchema = new mongoose.Schema({
   _id: String,
   name: String,
   surname: String,
   email: String,
   age: Number,
   membershipType: String,
   picture: String,
});

// Define the course schema
const courseSchema = new mongoose.Schema({
   _id: String,
   title: String,
   description: String,
   instructorName: String,
   instructorSurname: String,
   schedule: Date,
});

// Create the models based on the schemas
const Member = mongoose.model("Member", memberSchema);
const Course = mongoose.model("Course", courseSchema);

// ----- ROUTES -----

app.get("/", (req, res) => {
   res.send("Prova!");
})

// Obtain all the members data
app.get("/members", async (req, res) => {
   console.log("Getting all the members...");

   try {
      // Obtain members data (wait the response)
      // Only 3 fields
      const members = await Member.find({}).select("_id name surname");

      res.status(200).json(members);
   } catch (error) {
      res.status(500).json({ message: "Error getting members!", error })
   }
});

// Add a member
app.post("/members", async (req, res) => {
   console.log("Adding a member!");

   // Data dump
   const data = { ...req.body };

   // Add the id
   data._id = uuidv4();

   // Build the member payload
   const member = new Member(data);

   // Attempt to save member's data
   try {
      await member.save();
      res.status(200).json(member);
   } catch (error) {
      res.status(400).json(error);
   }
});

// Obtain a specific member data
app.get("/members/:_id", async (req, res) => {
   console.log("Getting member: " + req.params._id);

   try {
      // Obtain member data (wait the response)
      const member = await Member.findById(req.params._id).select("_id name surname email age membershipType picture");

      res.status(200).json(member);
   } catch (error) {
      res.status(500).json({ message: "Error getting member!", error })
   }
});

// Edit a specific member data
app.put("/members/:_id/edit", async (req, res) => {
   console.log("Editing member: " + req.params._id);

   try {
      // Find and update member
      const member = await Member.findByIdAndUpdate(
         req.params._id,
         req.body,
         // Return the doc and validate data
         { new: true, runValidators: true }
      );

      // Verify if the member has been found
      if (!member) {
         return res.status(404).json({ message: "Member not found!" });
      }

      res.status(200).json(member);
   } catch (error) {
      res.status(500).json({ message: "Error updating member!", error });
   }
});

// Obtain all the courses data
app.get("/courses", async (req, res) => {
   console.log("Getting all the courses...");

   try {
      // Obtain courses data (wait the response)
      // Only 4 fields
      const courses = await Course.find({}).select("_id title instructorName instructorSurname");

      res.status(200).json(courses);
   } catch (error) {
      res.status(500).json({ message: "Error getting courses!", error })
   }
});

// Delete a specific member by his id
app.delete("/members/:_id", async (req, res) => {
   console.log("Deleting: " + req.params._id);

   try {
      // Find the member by his id and then delete from the db
      // (wait the response)
      const member = await Member.findByIdAndDelete(req.params._id);

      res.status(200).json(member);
   } catch (error) {
      res.status(500).json({ message: "This member doesn't exist!", error});
   }
});

// Add a course
app.post("/courses", async (req, res) => {
   console.log("Adding a course!");

   // Data dump
   const data = { ...req.body };

   // Add the id
   data._id = uuidv4();

   // Build the course payload
   const course = new Course(data);

   // Attempt to save course's data
   try {
      await course.save();
      res.status(200).json(course);
   } catch (error) {
      res.status(400).json(error);
   }
});

// Obtain a specific course data
app.get("/courses/:_id", async (req, res) => {
   console.log("Getting course: " + req.params._id);

   try {
      // Obtain course data (wait the response)
      const course = await Course.findById(req.params._id).select("_id title description instructorName instructorSurname schedule");

      res.status(200).json(course);
   } catch (error) {
      res.status(500).json({ message: "Error getting course!", error })
   }
});

// Edit a specific course data
app.put("/courses/:_id/edit", async (req, res) => {
   console.log("Editing course: " + req.params._id);

   try {
      // Find and update course
      const course = await Course.findByIdAndUpdate(
         req.params._id,
         req.body,
         // Return the doc and validate data
         { new: true, runValidators: true }
      );

      // Verify if the course has been found
      if (!course) {
         return res.status(404).json({ message: "Course not found!" });
      }

      res.status(200).json(course);
   } catch (error) {
      res.status(500).json({ message: "Error updating member!", error });
   }
});

// Delete a specific course by his id
app.delete("/courses/:_id", async (req, res) => {
   console.log("Deleting: " + req.params._id);

   try {
      // Find the course by his id and then delete from the db
      // (wait the response)
      const course = await Course.findByIdAndDelete(req.params._id);

      res.status(200).json(course);
   } catch (error) {
      res.status(500).json({ message: "This course doesn't exist!", error});
   }
});

// Start the server and listens to a specific port
app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
});