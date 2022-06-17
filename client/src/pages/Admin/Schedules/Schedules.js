import React from "react";
import { useSchedules } from "./SchedulesContext";
import { Spinner } from "../../../components/Spinner";

import { SchedulesController } from "./SchedulesController";
import { SchedulesList } from "./SchedulesList";
import { SchedulesAvailability } from "./SchedulesAvailability";
import SchedulesMobile from "./SchedulesMobile/SchedulesMobile";

export default function AdminSchedules() {
  const { isLoading } = useSchedules();

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <SchedulesController />
          <SchedulesList />
          <SchedulesAvailability />
          <SchedulesMobile />
        </div>
      )}
    </>
  );
}
