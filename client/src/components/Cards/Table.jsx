import React, { useEffect, useState } from "react";
import api from "../../utils/api";// make sure your axios instance is properly configured

export default function Subjects() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/setup/preferences"); // adjust this route if needed
        setRows(
          res.data.map((subject, index) => ({
            id: index + 1,
            name: subject.name,
            professor: subject.professor,
            preference: "", // default empty or pull from backend if available
          }))
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load subjects.");
        console.log(err);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handlePreferenceChange = (id, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, preference: value } : row
      )
    );
  };

  const handleSubmit = async () => {
    const preferences = rows.map((row) => row.preference);
    try {
      await api.post("/setup/preferences", { preferences });
      setSuccess("Preferences updated successfully!");
    } catch (err) {
      setError("Failed to submit preferences");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full flex flex-col items-center mt-10 px-4">
      <div className="overflow-x-auto rounded-box border border-base-800 border-base-content/5 bg-base-100 w-full max-w-4xl">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject Name</th>
              <th>Professor</th>
              <th>Preference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.professor}</td>
                <td>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={row.preference}
                    onChange={(e) =>
                      handlePreferenceChange(row.id, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="important">Important</option>
                    <option value="optional">Optional</option>
                    <option value="boring">Boring</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button className="btn btn-neutral" onClick={handleSubmit}>
          Submit Preferences
        </button>
        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}
