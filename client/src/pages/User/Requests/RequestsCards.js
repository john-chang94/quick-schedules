import React from "react";

export const RequestsCards = ({ state, handleDeleteRequest }) => {
  // Format date to 'mm-dd-yyyy' without using new Date
  // Production fetches dates without timezone, while dev
  // fetches with timezone.. so manually parse date
  const handleFormatDate = (date) => {
    const init = date.split("T")[0];
    const split = init.split("-");
    const newDate = `${split[1]}-${split[2]}-${split[0]}`;
    return newDate;
  };

  return (
    state.requests.map((request, i) => (
      <div
        key={i}
        className="requests-cards border-solid-1 border-smooth my-2 text-center xs12 s10-offset-1 m8-offset-2 l6-offset-3"
      >
        <div className="flex">
          <div className="w-100">
            <div className="m-2">
              <strong>Submission date</strong>
              <p>{handleFormatDate(request.requested_at)}</p>
            </div>
            <div className="m-2">
              <p>
                <strong>Status</strong>
              </p>
              <em
                className={
                  request.status === "Pending"
                    ? "blue"
                    : request.status === "Approved"
                    ? "green"
                    : request.status === "Denied"
                    ? "red"
                    : ""
                }
              >
                {request.status}
              </em>
            </div>
          </div>
          <div className="w-100">
            <div className="m-2">
              <strong>Requested dates</strong>
              {request.requested_dates.map((rd, rd_i) => (
                <p key={rd_i}>
                  {rd_i === request.requested_dates.length - 1
                    ? handleFormatDate(rd)
                    : `${handleFormatDate(rd)},`}
                </p>
              ))}
            </div>
            <div className="m-2">
              <strong>Notes</strong>
              <p>{request.notes}</p>
            </div>
          </div>
        </div>
        <div className="my-2">
          <button
            className={`btn-sm ${
              !(state.isDeleting || request.status !== "Pending") &&
              "btn-hovered"
            }`}
            onClick={() => handleDeleteRequest(request.r_id)}
            // Disable if submitting or if request has already been approved/denied
            disabled={state.isDeleting || request.status !== "Pending"}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  );
};
