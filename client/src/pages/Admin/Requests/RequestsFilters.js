import React from "react";

export const RequestsFilters = ({ status, handleFilterRequests }) => {
  return (
    <div className="flex flex-col align-center">
      <p className="mb-2">View by</p>
      <div className="w-50 lg-w-60 md-w-80 xs-w-90 grid">
        <button
          className={`border-solid-1 border-oval pointer-no-dec py-1 hovered s6 l3
                        ${status === "All" && "bg-light-gray"}`}
          onClick={() => handleFilterRequests("All")}
        >
          All
        </button>
        <button
          className={`border-solid-1 border-oval pointer-no-dec py-1 hovered s6 l3
                        ${status === "Pending" && "bg-light-gray"}`}
          onClick={() => handleFilterRequests("Pending")}
        >
          Pending
        </button>
        <button
          className={`border-solid-1 border-oval pointer-no-dec py-1 hovered s6 l3
                        ${status === "Approved" && "bg-light-gray"}`}
          onClick={() => handleFilterRequests("Approved")}
        >
          Approved
        </button>
        <button
          className={`border-solid-1 border-oval pointer-no-dec py-1 hovered s6 l3
                        ${status === "Denied" && "bg-light-gray"}`}
          onClick={() => handleFilterRequests("Denied")}
        >
          Denied
        </button>
      </div>
    </div>
  );
};
