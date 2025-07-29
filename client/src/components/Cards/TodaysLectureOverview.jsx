import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function TodayLectureTable() {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLectures, setSelectedLectures] = useState([]);
    const [submittedToday, setSubmittedToday] = useState(false);

    const todayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    useEffect(() => {
        const storedDate = localStorage.getItem("attendance-submitted-date");
        const today = todayDate();

        if (storedDate === today) {
            setSubmittedToday(true);
            setLoading(false);
            return;
        }
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

        if (storedDate && storedDate !== today) {
            localStorage.removeItem("attendance-submitted-date");
        }

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
        const attendedLectures = timetable
            .filter((lecture) => selectedLectures.includes(lecture.id))
            .map((lecture) => lecture.subject);

        const unattendedLectures = timetable
            .filter((lecture) => !selectedLectures.includes(lecture.id))
            .map((lecture) => lecture.subject);

        try {
            const res = await api.post("/timetable/today", {
                attendedLectures,
                unattendedLectures,
            });

            const newDate = localStorage.setItem("attendance-submitted-date", todayDate());
            console.log(newDate);
            
            setSubmittedToday(true);
            console.log("Submitted successfully:", res.data);
            alert("Attendance submitted!");
        } catch (err) {
            console.error("Error submitting attendance:", err);
            alert("Failed to submit attendance.");
        }
    };

    return (
        <div className="flex justify-end items-center w-fit mr-20 bg-yellow-400 ">
            <div className="overflow-x-auto bg-base-100 shadow-lg rounded-xl p-4 w-2xs">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <span className="loading loading-spinner text-neutral"></span>
                    </div>
                ) : submittedToday ? (
                    <p className="text-center text-gray-400 font-medium">
                        You have already submitted today!
                    </p>
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
                                            checked={selectedLectures.includes(
                                                subject.id
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(subject.id)
                                            }
                                        />
                                        <div>
                                            <div className="font-medium">
                                                {subject.subject}
                                            </div>
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
