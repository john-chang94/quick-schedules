import React from "react";
import { useSchedules } from "../SchedulesContext";
import { SchedulesListMobile } from "./SchedulesListMobile";
import { AddShiftMobile } from "./AddShiftMobile";

export default function SchedulesMobile() {
  const {
    state: {
      isLoadingSchedule,
    }
  } = useSchedules();

  return (
    !isLoadingSchedule && (
      <div className="schedules-mobile">
        <AddShiftMobile />
        <SchedulesListMobile />
      </div>
    )
  );
}
