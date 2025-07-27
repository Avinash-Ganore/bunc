import mongoose from "mongoose";
import subjectSchema from "./subject.js";
import timetableSlotSchema from "./timetable.js";
import bcrypt from "bcrypt";
import attendanceSchema from "./dailyAttendance.js";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        year: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 4], // restricts values to valid years
        },

        rollNumber: {
            type: String,
            required: true,
            trim: true,
        },

        attendanceThreshold: {
            type: Number,
            default: 75, // Default 75%
        },

        subjects: [subjectSchema],

        timetable: [timetableSlotSchema],

        dailyAttendance: [attendanceSchema],

        notificationPreferences: {
            enabled: {
                type: Boolean,
                default: true,
            },
            time: {
                type: String,
                default: "17:00",
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("overallAttendance").get(function () {
    const total = this.subjects.reduce(
        (acc, sub) => acc + sub.subjectAttendance.total,
        0
    );
    const attended = this.subjects.reduce(
        (acc, sub) => acc + sub.subjectAttendance.attended,
        0
    );
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(2);
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
