import React, { useEffect, useState } from "react";
import api from "../../utils/api"; // Adjust based on your project structure

export default function TodayLectureTable() {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLectures, setSelectedLectures] = useState([]);

    useEffect(() => {
        const fetchTodayTimetable = async () => {
            try {
                const res = await api.get("/timetable/today");
                setTimetable(res.data); // Expected: [{ id, subject, professor }]
            } catch (err) {
                console.error("Error fetching timetable:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayTimetable();
    }, []);

    const handleCheckboxChange = (lectureId) => {
        setSelectedLectures((prevSelected) =>
            prevSelected.includes(lectureId)
                ? prevSelected.filter((id) => id !== lectureId)
                : [...prevSelected, lectureId]
        );
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post("/attendance/mark", {
                attendedLectures: selectedLectures,
            });
            console.log("Submitted successfully:", res.data);
            alert("Attendance submitted!");
        } catch (err) {
            console.error("Error submitting attendance:", err);
            alert("Failed to submit attendance.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
        <div className="overflow-x-auto bg-base-100 shadow-lg rounded-xl p-4 w-2xs">
            {loading ? (
                <div className="flex justify-center items-center">
                    <span className="loading loading-spinner text-neutral"></span>
                </div>
            ) : timetable.length === 0 ? (
                <p className="text-center text-gray-400">
                    No lectures scheduled for today!
                </p>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <ul className="list bg-base-100 rounded-box shadow-md">
                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                            Today's Lectures
                        </li>

                        {timetable.map((subject) => (
                            <li
                                key={subject.id}
                                className="list-row flex justify-between items-center p-3 border-b"
                            >
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={selectedLectures.includes(subject.id)}
                                        onChange={() => handleCheckboxChange(subject.id)}
                                    />
                                    <div>
                                        <div className="font-medium">{subject.subject}</div>
                                        <div className="text-xs uppercase font-thin opacity-60">
                                            {subject.professor}
                                        </div>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>

                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-neutral">
                            Submit Attendance
                        </button>
                    </div>
                </form>
            )}
        </div>
        </div>
    );
}
