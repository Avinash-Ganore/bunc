import React from "react";

export default function RegisterForm() {
    return (
        <div>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Register</legend>

                <label className="label">Name</label>
                <input
                    type="text"
                    className="input"
                    placeholder="My awesome page"
                />

                <label className="label">Email</label>
                <input
                    type="text"
                    className="input"
                    placeholder="my-awesome-page"
                />

                <label className="label">Department</label>
                <input type="text" className="input" placeholder="Name" />
                
                <label className="label">Year</label>
                <input type="text" className="input" placeholder="Name" />
                
                <label className="label">Roll Number</label>
                <input type="text" className="input" placeholder="Name" />
                
            </fieldset>
            
        </div>
    );
}
