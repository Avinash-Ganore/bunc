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
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUserEmail = 'john.doe@example.com';

    const existingUser = await User.findOne({ email: testUserEmail });

    const subjects = [
      {
            name: "Math",
            professor: "Dr. Smith",
            preference: "important",
            attendance: {
                attended: 7,
                total: 10,
            },
        },
        {
            name: "Physics",
            professor: "Dr. Johnson",
            preference: "optional",
            attendance: {
                attended: 5,
                total: 8,
            },
        },
    ];

    const timetable = [
       {
            day: "monday",
            startTime: "09:00",
            endTime: "10:00",
            subject: "Math",
        },
        {
            day: "tuesday",
            startTime: "10:00",
            endTime: "11:00",
            subject: "Physics",
        },
    ];

    if (existingUser) {
      existingUser.subjects = subjects;
      existingUser.timetable = timetable;
      await existingUser.save();
      console.log("Mock data updated for existing user.");
    } else {
      await User.create({
        name: "John Doe",
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
