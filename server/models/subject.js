import mongoose from "mongoose";

const { Schema } = mongoose;

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    professor: { 
        type: String, 
        required: true 
    },

    preference: {
        type: String,
        enum: ["important", "optional", "boring"],
        default: "important",
    },

    subjectAttendance: {
        attended: { 
            type: Number, 
            default: 0 
        },
        total: { 
            type: Number, 
            default: 0 
        },
    },
});

export default subjectSchema;