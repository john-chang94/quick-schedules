import React from "react";

export const RequestsCards = ({
  requests,
  handleFormatDate,
  handleUpdateRequestStatus,
  isUpdating,
}) => {
  return (
    <div className="requests-cards">
      {requests.length ? (
        requests.map((request, r_i) => (
          <div
            key={r_i}
            className="my-2 p-1 border-solid-1 border-smooth box-shadow flex flex-col align-center text-center"
          >
            <div className="my-2">
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
            <div className="flex flex-col w-100">
              <div className="my-1">
                <strong>
                  {request.first_name} {request.last_name}
                </strong>
                <p>{request.title}</p>
              </div>
              <div className="my-1">
                <strong>Requested dates</strong>
                {request.requested_dates.map((rd, rd_i) => (
                  <p key={rd_i}>
                    {
                      // Add commas if more than one date
                      rd_i === request.requested_dates.length - 1
                        ? handleFormatDate(rd)
                        : `${handleFormatDate(rd)},`
                    }
                  </p>
                ))}
              </div>
              <div className="my-1">
                <strong>Submission date</strong>
                <p>{handleFormatDate(request.requested_at)}</p>
              </div>
              <div className="my-1">
                <strong>Notes</strong>
                <p>{request.notes}</p>
              </div>
            </div>
            <div>
              <button
                className={`btn-md m-1 ${
                  isUpdating ? "" : "btn-hovered pointer-no-dec"
                }`}
                onClick={() =>
                  handleUpdateRequestStatus(request.r_id, "Approved")
                }
                disabled={isUpdating}
              >
                Approve
              </button>
              <button
                className={`btn-md m-1 ${
                  isUpdating ? "" : "btn-hovered pointer-no-dec"
                }`}
                onClick={() =>
                  handleUpdateRequestStatus(request.r_id, "Denied")
                }
                disabled={isUpdating}
              >
                Deny
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-3">None</p>
      )}
    </div>
  );
};
