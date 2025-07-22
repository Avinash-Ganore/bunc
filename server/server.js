
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./models/User.js";
import catchAsync from "./utils/catchAsync.js";
import { generateToken } from "./utilities.js";
import { authenticateUser } from "./utils/middleware.js";

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!!"))
    .catch((err) => {
        console.log("Error!!");
        console.log(err);
    });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.post(
    "/auth/signup",
    catchAsync(async (req, res) => {
        const { name, email, password, department, year, rollNumber } =
            req.body;

        if (
            !name ||
            !email ||
            !password ||
            !department ||
            !year ||
            !rollNumber
        ) {
            return res
                .status(400)
                .json({ error: true, message: "All fields are required." });
        }

        const userExists = await User.findOne({ email });
        if (userExists)
            return res
                .status(400)
                .json({ error: true, message: "User already exists." });

        try {
            const user = new User({
                name,
                email,
                password,
                department,
                year,
                rollNumber,
            });

            await user.save();
            if (!user) {
                return res
                    .status(400)
                    .json({ error: true, message: "User not created" });
            }

            res.status(201).json({
                error: false,
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    department: user.department,
                    year: user.year,
                    rollNumber: user.rollNumber,
                },
                message: "Registration Successful",
            });
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    })
);

app.post(
    "/auth/login",
    catchAsync(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        // console.log("Found user:", user);

        if (!user)
            return res
                .status(400)
                .json({ error: true, message: "Invalid credentials" });

        try {
            const isMatch = await user.matchPassword(password);
            if (!isMatch)
                return res
                    .status(400)
                    .json({ error: true, message: "Invalid credentials" });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }

        res.json({
            error: false,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                year: user.year,
                rollNumber: user.rollNumber,
            },
        });
    })
);

app.post(
    "/setup/subjects",
    authenticateUser,
    catchAsync(async (req, res) => {
    //    {
    //   "subjects": [
    //     { "name": "Math", "professor": "Dr. A"},
    //     { "name": "Physics", "professor":"Dr. B" }
    //          ]
    //    }
        const { subjects } = req.body;
        try {
            const user = await User.findById(req.user.id);
            // console.log("Found user:", user);
            // console.log([...subjects]);
            if (!user)
                return res
                    .status(400)
                    .json({ error: true, message: "User Not found" });

            user.subjects = subjects;
            await user.save();

            return res.json({
                error: false,
                token: generateToken(user._id),
                user: {
                    subjects: user.subjects,
                },
                message: "Subjects setup successful",
            });
        } catch (error) {
            console.error("Subject setup failed", error);
        }
    })
);

app.post(
    "/setup/preferences",
    authenticateUser,
    catchAsync(async (req, res) => {
        // {
        //   "preferences": [
        //     "boring",
        //     "optional"
        //   ]
        // }
        const { preferences } = req.body; // expecting: ["important", "optional", ...]

        try {
            // Fetch the user
            const user = await User.findById(req.user.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            // Update subject preferences
            user.subjects.forEach((subject, index) => {
                if (preferences[index]) {
                    subject.preference = preferences[index];
                }
            });

            await user.save();
            res.status(200).json({
                message: "Preferences updated successfully",
                user,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
);

app.post('/setup/timetable',authenticateUser,  catchAsync(async (req, res) => {
    // {
    //   "timetable": [
    //     {
    //       "day": "monday",
    //       "startTime": "09:00",
    //       "endTime": "10:00",
    //       "subject": "Maths"
    //     },
    //     {
    //       "day": "tuesday",
    //       "startTime": "10:00",
    //       "endTime": "11:00",
    //       "subject": "Physics"
    //     }
    //   ]
    // }
  const { timetable } = req.body;

  try {
    if (!Array.isArray(timetable)) {
      return res.status(400).json({ message: "Timetable must be an array" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.timetable = timetable; //  Overwrite old timetable or add new
    await user.save();

    res.status(200).json({ message: "Timetable setup successful", user });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}));

app.post('/setup/attendance-settings', authenticateUser, catchAsync(async (req, res) => {
  try {
    const {
      attendanceThreshold,
      notificationPreferences
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // update attendance settings
    if (attendanceThreshold !== undefined)
      user.attendanceThreshold = attendanceThreshold;

    if (notificationPreferences) {
      if (notificationPreferences.enabled !== undefined)
        user.notificationPreferences.enabled = notificationPreferences.enabled;

      if (notificationPreferences.time)
        user.notificationPreferences.time = notificationPreferences.time;
    }

    await user.save();

    res.status(200).json({ message: 'Attendance settings updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}));



app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).json("error", { err });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
