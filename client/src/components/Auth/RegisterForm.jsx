import React from "react";
import api from "../../utils/api";
import { useState } from "react";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        year: "",
        rollNumber: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await api.post("/auth/signup", formData);
            setSuccess("Signup successful!");
            console.log("Form data being submitted:", formData);
            // TODO: Redirect or update context/state
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-94 border p-4">
                    <legend className="fieldset-legend">Register</legend>

                    <label className="label">Name</label>
                    <input
                        name="name"
                        type="text"
                        className="input"
                        placeholder="Full Name"
                        onChange={handleChange}
                        value={formData.name}
                    />

                    <label className="label">Department</label>
                    <input
                        name="department"
                        type="text"
                        className="input"
                        placeholder="Department"
                        onChange={handleChange}
                        value={formData.department}
                    />

                    <label className="label">Year</label>
                    <input
                        name="year"
                        type="text"
                        className="input"
                        placeholder="Year"
                        onChange={handleChange}
                        value={formData.year}
                    />

                    <label className="label">Roll Number</label>
                    <input
                        name="rollNumber"
                        type="text"
                        className="input"
                        placeholder="Roll Number"
                        onChange={handleChange}
                        value={formData.rollNumber}
                    />

                    <label className="label">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="input"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                    />

                    <label className="label">Password</label>
                    <input
                        name="password"
                        type="password"
                        className="input"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                    />

                    <button type="submit" className="btn btn-neutral mt-4">
                        Sign Up
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && (
                        <p className="text-green-500 text-sm">{success}</p>
                    )}
                </fieldset>
            </form>
        </div>
    );
}
