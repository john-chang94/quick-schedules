import React from "react";
import { format } from "date-fns";

export const RequestsList = ({
  requests,
  handleFormatDate,
  handleUpdateRequestStatus,
  isUpdating,
}) => {
  return (
    <table className="border-collapse w-100 requests-table">
      <thead>
        <tr>
          <th className="p-2 border-solid-1">Name</th>
          <th className="p-2 border-solid-1">Requested Dates</th>
          <th className="p-2 border-solid-1">Notes</th>
          <th className="p-2 border-solid-1">Submission Date</th>
          <th className="p-2 border-solid-1">Status</th>
          <th className="p-2 border-solid-1">Edit</th>
        </tr>
      </thead>
      <tbody>
        {requests.length &&
          requests.map((request, i) => (
            <tr
              key={i}
              style={
                i % 2 === 0
                  ? { backgroundColor: "rgb(240, 240, 240)" }
                  : { backgroundColor: "rbg(255, 255, 255)" }
              }
            >
              <td className="py-1 px-2">
                {request.first_name} {request.last_name} <br />
                <em className="text-3">{request.title}</em>
              </td>
              <td className="py-1 px-2">
                {request.requested_dates.map((rd, rd_i) => (
                  <span key={rd_i}>
                    {
                      // Add commas if more than one date
                      rd_i === request.requested_dates.length - 1
                        ? handleFormatDate(rd)
                        : `${handleFormatDate(rd)}, `
                    }
                  </span>
                ))}
              </td>
              <td className="py-1 px-2">{request.notes}</td>
              <td className="py-1 px-2 text-center">
                {format(new Date(request.requested_at), "MM-dd-yyyy")}
              </td>
              <td
                className={
                  request.status === "Pending"
                    ? "blue py-1 px-2 text-center"
                    : request.status === "Approved"
                    ? "green py-1 px-2 text-center"
                    : request.status === "Denied"
                    ? "red py-1 px-2 text-center"
                    : ""
                }
              >
                {request.status}
              </td>
              <td className="p-1 text-center">
                <button
                  className={`btn-sm m-1 ${
                    !isUpdating && "btn-hovered pointer-no-dec"
                  }`}
                  onClick={() =>
                    handleUpdateRequestStatus(request.r_id, "Approved")
                  }
                  disabled={isUpdating}
                >
                  Approve
                </button>
                <button
                  className={`btn-sm m-1 ${
                    !isUpdating && "btn-hovered pointer-no-dec"
                  }`}
                  onClick={() =>
                    handleUpdateRequestStatus(request.r_id, "Denied")
                  }
                  disabled={isUpdating}
                >
                  Deny
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
