import React, { useState } from "react";
import api from "../../utils/api";

export default function ThresholdComponent() {
    const [form, setform] = useState({
        attendanceThreshold: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/setup/attendance-settings", {
                attendanceThreshold: Number(form.attendanceThreshold),
            }); // adjust this route if needed
            console.log("Threshold set successfully:", res.data);
        } catch (err) {
            console.error("Failed to set threshold:", err);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend text-lg">
                        Threshold
                    </legend>

                    <input
                        name="attendanceThreshold"
                        type="number"
                        min="0"
                        max="100"
                        className="input"
                        placeholder="default: 75"
                        value={form.attendanceThreshold}
                        onChange={(e) => {
                            setform({
                                ...form,
                                attendanceThreshold: e.target.value,
                            });
                        }}
                    />

                    <button className="btn btn-neutral mt-4">Set</button>
                </fieldset>
            </form>
        </div>
    );
}
