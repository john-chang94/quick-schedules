import React, { useRef } from "react";
import { useSchedules } from "../SchedulesContext";
import { SchedulesListMobile } from "./SchedulesListMobile";
import { AddShiftMobile } from "./AddShiftMobile";

export default function SchedulesMobile() {
  const modalRef = useRef();

  const {
    state: {
      isLoadingSchedule,
    }
  } = useSchedules();

  return (
    !isLoadingSchedule && (
      <div className="schedules-mobile">
        <AddShiftMobile modalRef={modalRef} />
        <SchedulesListMobile />
      </div>
    )
  );
}
