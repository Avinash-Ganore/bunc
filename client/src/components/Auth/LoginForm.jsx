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
            <form onSubmit={handleSubmit} noValidate>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">Login</legend>

                    <label className="input validator mb-2">
                        <svg
                            className="h-[1em] opacity-50"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                ></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </g>
                        </svg>
                        <input
                            type="email"
                            placeholder="mail@site.com"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className="validator-hint hidden">
                        Enter valid email address
                    </div>

                    <label className="input validator">
                        <svg
                            className="h-[1em] opacity-50"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                <circle
                                    cx="16.5"
                                    cy="7.5"
                                    r=".5"
                                    fill="currentColor"
                                ></circle>
                            </g>
                        </svg>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            minLength="8"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                    <p className="validator-hint hidden">
                        Must be more than 8 characters, including
                        <br />
                        At least one number <br />
                        At least one lowercase letter <br />
                        At least one uppercase letter
                    </p>

                    <button className="btn btn-neutral mt-4">Login</button>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && (
                        <p className="text-green-500 mt-2">{success}</p>
                    )}
                </fieldset>
            </form>
        </>
    );
}
