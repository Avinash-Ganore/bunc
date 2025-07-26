import { useEffect, useState } from "react";
import api from "../../utils/api";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function TimetableComponent() {
    const [rows, setRows] = useState([{ id: 1, day: "", subject: "", startTime: "", endTime: "" }]);
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get("/user/subjects", { withCredentials: true });
                setSubjects(res.data || []);
            } catch (err) {
                console.error("Error fetching subjects", err);
            }
        };

        fetchSubjects();
    }, []);

    const addRow = () => {
        setRows((prev) => [...prev, { id: prev.length + 1, day: "", subject: "", startTime: "", endTime: "" }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows((prev) => prev.filter((row) => row.id !== id));
        }
    };

    const handleChange = (id, field, value) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const handleSubmit = async () => {
        try {
            const timetable = rows.map(({ day, subject, startTime, endTime }) => ({
                day, subject, startTime, endTime
            }));

            const res = await api.post("/setup/timetable", { timetable }, { withCredentials: true });

            setSuccess("Timetable submitted successfully!");
            setError("");
            console.log("Submitted:", res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit timetable");
            setSuccess("");
        }
    };

    return (
        <div className="w-full flex items-start mt-30 justify-center">
            <div className="overflow-x-auto rounded-box border border-base-800 border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th className="w-30">Start Time</th>
                            <th className="w-30">End Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={row.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <select
                                        value={row.day}
                                        onChange={(e) => handleChange(row.id, "day", e.target.value)}
                                        className="select select-ghost"
                                    >
                                        <option value="" disabled>Choose day</option>
                                        {days.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={row.subject}
                                        onChange={(e) => handleChange(row.id, "subject", e.target.value)}
                                        className="select select-ghost"
                                    >
                                        <option value="" disabled>Choose subject</option>
                                        {subjects.map((subj) => (
                                            <option key={subj._id} value={subj.name}>{subj.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="time"
                                        value={row.startTime}
                                        onChange={(e) => handleChange(row.id, "startTime", e.target.value)}
                                        className="input input-bordered"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="time"
                                        value={row.endTime}
                                        onChange={(e) => handleChange(row.id, "endTime", e.target.value)}
                                        className="input input-bordered "
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-ghost" disabled={rows.length === 1} onClick={() => removeRow(row.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end gap-4 mt-4 absolute bottom-4 right-4 p-10">
                <button className="btn btn-neutral" onClick={addRow}>Add Row</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
            {success && <div className="text-green-500 mt-4">{success}</div>}
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
