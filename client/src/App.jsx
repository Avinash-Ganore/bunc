import React from "react";
import { Route, Routes, Link, BrowserRouter } from "react-router";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Preference from "./pages/Setup/Preference";
import Subjects from "./pages/Setup/Subjects";
import Threshold from "./pages/Setup/Threshold";
import Timetable from "./pages/Setup/Timetable";
import CollegeStart from "./pages/Setup/CollegeStart";
import CollegeStarted from "./pages/Setup/CollegeStarted";
import Dashboard from "./pages/Dashboard";
import CollegeNotStarted from "./pages/Setup/CollegeNotStarted";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/auth">
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                </Route>
                <Route path="/setup">
                    <Route path="preference" element={<Preference />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="threshold" element={<Threshold />} />
                    <Route path="timetable" element={<Timetable />} />
                    <Route path="start">
                        <Route index element={<CollegeStart />} />
                        <Route path="started" element={<CollegeStarted />} />
                        <Route
                            path="not-started"
                            element={<CollegeNotStarted />}
                        />
                    </Route>
                </Route>
                <Route path="/Dashboard" element={<Dashboard />} />
            </Routes>
        </>
    );
}
