import React from 'react'
import TodaysLectureOverview from '../components/Cards/TodaysLectureOverview'
import OverallAttendanceProgress from '../components/Charts/OverallAttendanceProgress'

export default function Dashboard() {
  return (
    <>
      <OverallAttendanceProgress />
    <div className=''>
      <TodaysLectureOverview />
    </div>
    </>
  )
}
