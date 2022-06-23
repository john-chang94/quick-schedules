import React from "react";
import { format } from "date-fns";

export const RequestsList = ({ state, handleDeleteRequest }) => {
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
    <table className="border-collapse w-100 requests-table">
      <thead>
        <tr>
          <th className="p-2 border-solid-1"></th>
          <th className="p-2 border-solid-1">Requested Dates</th>
          <th className="p-2 border-solid-1">Notes</th>
          <th className="p-2 border-solid-1">Submission Date</th>
          <th className="p-2 border-solid-1">Status</th>
        </tr>
      </thead>
      <tbody>
        {state.requests.length
          ? state.requests.map((request, i) => (
              <tr
                key={i}
                style={
                  i % 2 === 0
                    ? { backgroundColor: "rgb(240, 240, 240)" }
                    : { backgroundColor: "rbg(255, 255, 255)" }
                }
              >
                <td className="py-1 px-2 text-center">
                  <button
                    className={`border-none bg-none ${
                      request.status === "Pending" && "pointer-no-dec"
                    }`}
                    style={{ padding: "2px" }}
                    disabled={request.status !== "Pending"}
                    onClick={() => handleDeleteRequest(request.r_id)}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
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
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );
};
