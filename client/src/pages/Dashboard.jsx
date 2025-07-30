import React from 'react'
import TodaysLectureOverview from '../components/Cards/TodaysLectureOverview'
import OverallAttendanceProgress from '../components/Charts/OverallAttendanceProgress'
import OverallAttendance from '../components/Charts/OverallAttendance'

export default function Dashboard() {
  return (
    <>
      <OverallAttendanceProgress />
    <div className=''>
      <TodaysLectureOverview />
      <OverallAttendance />
    </div>
    </>
  )
}
