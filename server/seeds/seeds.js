// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bunk");
    console.log("Connected to MongoDB");
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash('test1234', 10);

    const testUserEmail = 'testuser@example.com';

    const existingUser = await User.findOne({ email: testUserEmail });

    const subjects = [
      { name: "Data Structures", professor: "Dr. Sharma", preference: "important" },
      { name: "Digital Circuits", professor: "Dr. Mehta", preference: "boring" },
      { name: "Maths", professor: "Prof. Iyer", preference: "optional" },
    ];

    const timetable = [
      { day: "Monday", time: "09:00-10:00", subject: "Data Structures" },
      { day: "Monday", time: "10:00-11:00", subject: "Maths" },
      { day: "Tuesday", time: "09:00-10:00", subject: "Digital Circuits" },
      { day: "Wednesday", time: "09:00-10:00", subject: "Data Structures" },
      { day: "Thursday", time: "11:00-12:00", subject: "Maths" },
      { day: "Friday", time: "10:00-11:00", subject: "Digital Circuits" }
    ];

    if (existingUser) {
      existingUser.subjects = subjects;
      existingUser.timetable = timetable;
      await existingUser.save();
      console.log("Mock data updated for existing user.");
    } else {
      await User.create({
        name: "Test User",
        email: testUserEmail,
        password: hashedPassword,
        department: "Computer Engineering",
        year: 2,
        rollNumber: "CE1234",
        attendanceThreshold: 75,
        subjects,
        timetable
      });
      console.log("Mock user created with sample subjects and timetable.");
    }

    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err.message);
    process.exit(1);
  }
};

seedDatabase();
