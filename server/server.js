import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./models/User.js";
import catchAsync from "./utils/catchAsync.js";
import { generateToken, getTodayDate } from "./utilities.js";
import { authenticateUser } from "./middlewares/authenticateUser.js";
import ExpressError from "./utils/ExpressError.js";
import cookieParser from "cookie-parser";

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

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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

            const token = generateToken(user._id);

            const isProduction = process.env.NODE_ENV === "production";

            res.cookie("token", token, {
                httpOnly: true,
                secure: false, //NOTES: set true in production
                sameSite: isProduction ? "None" : "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(201).json({
                error: false,
                token: token,
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
            return res.status(500).json({
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

        const token = generateToken(user._id);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, //NOTES: set true in production
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            error: false,
            token: token,
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

app.get("/user/subjects", authenticateUser, async (req, res) => {
    const userId = req.user.id; // from your verifyToken middleware
    try {
        const user = await User.findById(userId);
        res.status(200).json(user.subjects);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post(
    "/setup/preferences",
    authenticateUser,
    catchAsync(async (req, res) => {
        // req.body
        // {
        //   "preferences": [
        //     "boring",
        //     "optional"
        //   ]
        // }
        const { preferences } = req.body;

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

app.post(
    "/setup/timetable",
    authenticateUser,
    catchAsync(async (req, res) => {
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
                return res
                    .status(400)
                    .json({ message: "Timetable must be an array" });
            }

            const user = await User.findById(req.user.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            user.timetable = timetable; //  Overwrite old timetable or add new
            await user.save();

            res.status(200).json({
                message: "Timetable setup successful",
                user,
            });
        } catch (err) {
            res.status(500).json({
                error: "Server error",
                details: err.message,
            });
        }
    })
);

app.post(
    "/setup/attendance-settings",
    authenticateUser,
    catchAsync(async (req, res) => {
        try {
            const { attendanceThreshold, notificationPreferences } = req.body;

            const user = await User.findById(req.user.id);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            // update attendance settings
            if (attendanceThreshold !== undefined)
                user.attendanceThreshold = attendanceThreshold;

            if (notificationPreferences) {
                if (notificationPreferences.enabled !== undefined)
                    user.notificationPreferences.enabled =
                        notificationPreferences.enabled;

                if (notificationPreferences.time)
                    user.notificationPreferences.time =
                        notificationPreferences.time;
            }

            await user.save();

            res.status(200).json({
                message: "Attendance settings updated successfully",
                user,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    })
);
// GET /api/timetable/today
app.get("/timetable/today", authenticateUser, async (req, res) => {
    const userId = req.user.id;
    const day = new Date().toLocaleDateString(
        "en-US",
        { weekday: "long" }
    );
    // console.log(day); // e.g., "Monday"

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const todayTimetable = user.timetable.filter((s) => s.day === day);
    const subjects = user.subjects;

    const timetableSubjects = todayTimetable.map((s) => {
        return {
            subject: s.subject,
            id: s._id,
        };
    });
    timetableSubjects.map((s) => {
        subjects.filter((sub) => {
            if (sub.name === s.subject) {
                s.professor = sub.professor;
            }
        });
    });
    res.json(timetableSubjects);
});

app.post("/timetable/today", authenticateUser, async (req, res) => {
    // req.body
    // {
    //   attendedlectures : [Math, English],
    //   unattendedLLectures : [emft, DBMS]
    // }
    const { attendedLectures, unattendedLectures } = req.body;
    const today = getTodayDate();
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const alreadyMarked = user.dailyAttendance
        .map((entry) => entry.date.toISOString().split("T")[0])
        .some((entry) => entry === today);

    if (alreadyMarked) {
        return res
            .status(409)
            .json({ message: "Attendance already marked for today." });
    }

    user.dailyAttendance.push({
        Date: new Date().setHours(0, 0, 0, 0),
        lecturesAttended: attendedLectures,
    });

    user.subjects.map((subject) => {
        attendedLectures.map((attendedLecture) => {
            if (subject.name === attendedLecture) {
                subject.subjectAttendance.attended++;
                subject.subjectAttendance.total++;
            }
        });
        unattendedLectures.map((unattendedLecture) => {
            if (subject.name === unattendedLecture) {
                subject.subjectAttendance.total++;
            }
        });
    });

    await user.save();
    res.json(user);
});

// app.all(/.*/, (req, res, next) => {
//     next(new ExpressError("Page Not Found", 404));
// });

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = "Something went wrong!";
//     res.status(statusCode).json("error", { err });
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
