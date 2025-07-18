import mongoose from "mongoose";
import subjectSchema from "./subject.js";
import timetableSlotSchema from "./timetable.js";

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

        notificationPreferences: {
            enabled: {
                type: Boolean,
                default: true,
            },
            remindBeforeMinutes: {
                type: Number,
                default: 15,
            },
        },
    },
    { timestamps: true }
);

userSchema.virtual("overallAttendance").get(function () {
    const total = this.subjects.reduce(
        (acc, sub) => acc + sub.attendance.total,
        0
    );
    const attended = this.subjects.reduce(
        (acc, sub) => acc + sub.attendance.attended,
        0
    );
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(2);
});

const User = mongoose.model("User", userSchema);

export default User;
