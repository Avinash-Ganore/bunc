import React from "react";
import { useState } from "react";
import api from "../../utils/api";

export default function LoginForm() {
    const [formData, setFormData] = useState({
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
            const res = await api.post("/auth/login", formData);
            console.log("Login success:", res.data);

            setSuccess("Login successful!");
            // Redirect or set context state here as needed
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "Login failed");
        }
    };
    return (
        <>
        <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-94 border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Email</label>
                <input type="email" name="email" className="input" value={formData.email}
                    onChange={handleChange} placeholder="Email" />

                <label className="label">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button className="btn btn-neutral mt-4">Login</button>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </fieldset>
        </form>
        </>
    );
}
