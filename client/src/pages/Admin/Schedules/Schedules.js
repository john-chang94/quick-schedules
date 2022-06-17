import React from "react";
import Loader from "react-loader-spinner";

import { useSchedules } from "./SchedulesContext";
import { SchedulesController } from "./SchedulesController";
import { SchedulesList } from "./SchedulesList";
import { SchedulesAvailability } from "./SchedulesAvailability";
import SchedulesMobile from "./SchedulesMobile/SchedulesMobile";

export default function AdminSchedules() {
  const { isLoading } = useSchedules();

  return (
    <>
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
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
