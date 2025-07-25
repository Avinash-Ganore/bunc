import React, { useState } from "react";
import api from "../../utils/api";

export default function Subjects() {
  const [rows, setRows] = useState([{ id: 1, subject: "", professor: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { id: prevRows.length + 1, subject: "", professor: "" },
    ]);
  };
  
  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };
  
  const handleSubmit = async () => {
    
    try {
        const dataToSend = rows.map((row) => ({
          name: row.subject,
          professor: row.professor,
        }));
  
        const res = await api.post("/setup/subjects", {subjects: dataToSend}); // or `api.post('/setup/subjects', { subjects: dataToSend })` based on your backend
        setSuccess("Subjects added successfully!");
        setError("");
        console.log("Data sent to backend:", dataToSend);
  
        // Reset rows if needed
        // setRows([{ id: 1, subject: "", professor: "" }]);
      } catch (err) {
        console.error("Submission failed:", err);
        setError(err.response?.data?.message || "Submission failed");
        setSuccess("");
      }
  }
  

  return (
    <div className="w-full flex items-start mt-30 justify-center">
      <div className="overflow-x-auto rounded-box border border-base-800 border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Subject Name</th>
              <th>Professor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={row.subject}
                    className="input input-ghost w-full max-w-xs"
                    placeholder="e.g. Data Structures"
                    onChange={(e) =>
                      setRows((prevRows) =>
                        prevRows.map((r) =>
                          r.id === row.id ? { ...r, subject: e.target.value } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.professor}
                    className="input input-ghost w-full max-w-xs"
                    placeholder="e.g. Dr. Sharma"
                    onChange={(e) =>
                      setRows((prevRows) =>
                        prevRows.map((r) =>
                          r.id === row.id ? { ...r, professor: e.target.value } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-ghost"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4 absolute bottom-4 right-4 p-10 ">
        <button className="btn btn-neutral" onClick={addRow}>Add Row</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      </div>
      {success && (
        <div className="text-green-500 mt-4">{success}</div>
      )}
      {error && (
        <div className="text-red-500 mt-4">{error}</div>
      )}
    </div>
  );
}

