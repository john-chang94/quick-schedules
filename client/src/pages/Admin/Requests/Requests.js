import { useEffect, useState } from "react";
import {
  getRequestsByStatus,
  getRequests,
  updateRequestStatus,
} from "../../../services/requests";
import { isAuthenticated } from "../../../services/auth";

import { Spinner } from "../../../components/Spinner";
import { RequestsList } from "./RequestsList";
import { RequestsCards } from "./RequestsCards";
import { RequestsFilters } from "./RequestsFilters";

export default function AdminRequests() {
  const [requests, setRequests] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState("All");

  const handleUpdateRequestStatus = async (r_id, status) => {
    const update = window.confirm("Confirm decision?");
    if (update) {
      setIsUpdating(true);
      const tokenConfig = isAuthenticated();
      const body = { status };

      await updateRequestStatus(r_id, body, tokenConfig);
      const requests = await getRequests();

      setRequests(requests);
      setIsUpdating(false);
    }
  };

  const handleFilterRequests = async (status) => {
    setIsLoading(true);
    if (status === "All") {
      const requests = await getRequests();
      setRequests(requests);
      setStatus(status);
      setIsLoading(false);
    } else {
      const requests = await getRequestsByStatus(status);
      setRequests(requests);
      setStatus(status);
      setIsLoading(false);
    }
  };

  // Format date to 'mm-dd-yyyy' without using new Date
  // Production fetches dates without timezone, while dev
  // fetches with timezone.. so manually parse date
  const handleFormatDate = (date) => {
    const init = date.split("T")[0];
    const split = init.split("-");
    const newDate = `${split[1]}-${split[2]}-${split[0]}`;
    return newDate;
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const requests = await getRequests();
      if (requests && isMounted) {
        setRequests(requests);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, []);

  return (
    <div className="requests-container">
      <RequestsFilters
        status={status}
        handleFilterRequests={handleFilterRequests}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-5">
          <RequestsList // Large screens
            requests={requests}
            handleFormatDate={handleFormatDate}
            handleUpdateRequestStatus={handleUpdateRequestStatus}
            isUpdating={isUpdating}
          />
          <RequestsCards // Small screens
            requests={requests}
            handleFormatDate={handleFormatDate}
            handleUpdateRequestStatus={handleUpdateRequestStatus}
            isUpdating={isUpdating}
          />
        </div>
      )}
    </div>
  );
}
