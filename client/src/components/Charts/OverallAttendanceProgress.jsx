import React, { useEffect, useState } from 'react'
import api from '../../utils/api'

export default function OverallAttendanceProgress() {
  const [attendance, setAttendance] = useState(0)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/dashboard/overallprogress"); 
        setAttendance(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAttendance();
  }, []);
  return (
    <div>
      <progress className="progress progress-neutral w-56" value={attendance} max="100"></progress>
    </div>
  )
}
