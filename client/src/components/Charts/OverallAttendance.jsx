import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import getDateAndMonthIST from "../../utils/dateAndMonthIST";

export default function OverallAttendance() {
  const [attendance, setAttendance] = useState([]);
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/dashboard/attendanceprogress");
        const { data } = res;
        data.forEach((obj) => {
          obj.date = getDateAndMonthIST(obj.date);
        });
        setAttendance(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAttendance();
  }, []);
  return (
    <div>
      <AreaChart
        width={730}
        height={250}
        data={attendance}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="totalLectures" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis width="50" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value, name) => [`${value}`, "Lectures attended"]}
        />
        <Area
          type="monotone"
          dataKey="totalLectures"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#totalLectures)"
        />
      </AreaChart>
    </div>
  );
}
