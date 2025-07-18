import mongoose from "mongoose";

const { Schema } = mongoose;

const timetableSlotSchema = new 
Schema({
    day: {
        type: String,
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        required: true,
    },

    time: {
        type: String,
        required: true,
    }, 
    // You could later split into startTime, endTime
    subject: { 
        type: String, 
        required: true 
    },
});

export default timetableSlotSchema;
