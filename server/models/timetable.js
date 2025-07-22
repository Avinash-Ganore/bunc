import mongoose from "mongoose";

const { Schema } = mongoose;

const timetableSlotSchema = new 
Schema({
    day: {
        type: String,
        enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ],
        required: true,
    },

    startTime: {
        type: String,
        required: true,
    },

    endTime: {
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
