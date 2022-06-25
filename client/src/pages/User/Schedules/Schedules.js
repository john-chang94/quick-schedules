import React from "react";
import { Spinner } from "../../../components/Spinner";
import { SchedulesController } from "./SchedulesController";
import { SchedulesList } from "./SchedulesList";
import { useSchedules } from "../../Admin/Schedules/SchedulesContext";
import { SchedulesMobile } from "./SchedulesMobile";

export default function UserSchedules() {
  const {
    state: { isLoadingSchedule },
    isLoading,
  } = useSchedules();

  if (isLoading) return <Spinner />;

  return (
    <>
      <SchedulesController />
      {isLoadingSchedule ? (
        <Spinner />
      ) : (
        <>
          <SchedulesList />
          <SchedulesMobile />
        </>
      )}
    </>
  );
}
