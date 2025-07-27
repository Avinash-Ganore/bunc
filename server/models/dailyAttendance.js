import mongoose from "mongoose";

const { Schema } = mongoose;

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  lecturesAttended: {
    type: [String], // or [{ subjectName: String }] etc.
    default: [],
  },
},{ _id: false });

attendanceSchema.virtual('totalLectures').get(function () {
  return this.lecturesAttended.length;
});

// Ensure virtuals are included in JSON/Object
attendanceSchema.set('toObject', { virtuals: true });
attendanceSchema.set('toJSON', { virtuals: true });



export default attendanceSchema;
