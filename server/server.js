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
            const isMatch = await user.matchPassword(JSON.stringify(password));
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
        //  [{name: "", professor:""}]
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
