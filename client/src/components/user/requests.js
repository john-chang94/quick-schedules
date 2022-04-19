import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { isAuthenticated } from "../../services/auth";
import Loader from "react-loader-spinner";
import {
  createRequest,
  deleteRequest,
  getRequestsByUserUser,
} from "../../services/requests";
import { format } from "date-fns";

export default function UserRequests() {
  const { verifiedUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNewRequest, setCreateNewRequest] = useState(false);
  const [requests, setRequests] = useState(null);
  const [notes, setNotes] = useState("");
  const [dates, setDates] = useState([]);
  // Keep track of the number of date values to determine
  // how many date selectors are rendered
  const [numOfDateInputs, setNumOfDateInputs] = useState(1);

  const handleDeleteRequest = async (r_id) => {
    const doDelete = window.confirm("Delete request?");
    if (doDelete) {
      setIsDeleting(true);
      const tokenConfig = isAuthenticated();

      // Delete request and refresh list
      await deleteRequest(r_id, tokenConfig);
      const requests = await getRequestsByUserUser(verifiedUser.u_id);
      setRequests(requests);
      setIsDeleting(false);
    }
  };

  const handleCreateRequest = async () => {
    const request = window.confirm("Submit request?");
    if (request) {
      setIsSubmitting(true);
      const tokenConfig = isAuthenticated();
      let datesArr = dates.slice();

      // Format each date for storing in db
      for (let i = 0; i < datesArr.length; i++) {
        datesArr[i] = new Date(datesArr[i]).toISOString();
      }

      const body = {
        u_id: verifiedUser.u_id,
        requested_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        notes,
        requested_dates: datesArr,
      };

      // Create new request and refresh list
      await createRequest(body, tokenConfig);
      const requests = await getRequestsByUserUser(verifiedUser.u_id);

      setRequests(requests);
      setCreateNewRequest(false);
      clearForm();
      setIsSubmitting(false);
    }
  };

  const handleCancelCreateNewRequest = () => {
    setCreateNewRequest(false);
    clearForm();
  };

  const clearForm = () => {
    setNumOfDateInputs(1);
    setDates([]);
    setNotes("");
  };

  const handleAddDate = (index, newDate) => {
    // Run if date value already exists in array to replace old value
    if (dates[index] !== undefined) {
      let arrCopy = dates.slice();
      // Replace old date with selected date
      arrCopy.splice(index, 1, newDate);
      setDates(arrCopy);
    } else {
      // Else, add new date value
      setDates([...dates, newDate]);
    }
  };

  const handleRemoveDate = (index) => {
    let arrCopy = dates.slice();
    // Remove selected date from dates array
    arrCopy.splice(index, 1);
    setDates(arrCopy);
    setNumOfDateInputs(numOfDateInputs - 1);
  };

  // First date selector
  // Does not include a delete button
  const DateElement = ({ index }) => (
    <div className="my-2">
      <p>Select date</p>
      <input
        type="date"
        value={dates[index] !== undefined ? dates[index] : ""}
        onChange={({ target }) => handleAddDate(index, target.value)}
      />
    </div>
  );

  // Additional date selectors
  const XDateElement = ({ index }) => (
    <div className="my-2">
      <p>Select date</p>
      <input
        type="date"
        value={dates[index] !== undefined ? dates[index] : ""}
        onChange={({ target }) => handleAddDate(index, target.value)}
      />
      <button
        className="btn-sm btn-hovered mt-2"
        onClick={() => handleRemoveDate(index)}
      >
        <i className="fas fa-minus"></i>&nbsp;Date
      </button>
    </div>
  );

  // Render date selectors based on numOfDateInputs
  const renderDateElements = () => {
    let dateElements = [];
    // Render based on number of values that are stored in dates array
    for (let i = 0; i < numOfDateInputs; i++) {
      if (numOfDateInputs > 1 && i === numOfDateInputs - 1) {
        // Render additional date selectors
        dateElements.push(<XDateElement key={i} index={i} />);
      } else {
        // Render initial date selector
        dateElements.push(<DateElement key={i} index={i} />);
      }
    }

    // Return date selectors to render
    return dateElements;
  };

  const renderNewRequest = () => (
    <div className="border-solid-1 border-smooth my-2 flex flex-col align-center text-center xs12 s10-offset-1 m8-offset-2 l6-offset-3">
      <div className="w-50">
        {renderDateElements()}
        <button
          className={`btn-sm mb-2 ${
            dates.length === numOfDateInputs && "btn-hovered"
          }`}
          // Disable if next date is not yet selected
          disabled={dates.length !== numOfDateInputs}
          onClick={() => setNumOfDateInputs(numOfDateInputs + 1)}
        >
          <i className="fas fa-plus"></i>&nbsp;Date
        </button>
      </div>
      <div>
        <p>Notes</p>
        <textarea
          className="h-10 p-1"
          onChange={({ target }) => setNotes(target.value)}
        ></textarea>
      </div>
      <div>
        <button
          className="btn-med btn-hovered m-3"
          disabled={isSubmitting}
          onClick={() => handleCreateRequest()}
        >
          Submit
        </button>
        <button
          className="btn-med btn-hovered m-3"
          disabled={isSubmitting}
          onClick={() => handleCancelCreateNewRequest()}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderRequests = () =>
    requests &&
    requests.map((request, i) => (
      <div
        key={i}
        className="border-solid-1 border-smooth my-2 text-center xs12 s10-offset-1 m8-offset-2 l6-offset-3"
      >
        <div className="flex">
          <div className="w-100">
            <div className="m-2">
              <strong>Submission date</strong>
              <p>{new Date(request.requested_at).toLocaleDateString()}</p>
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
                    ? new Date(rd).toLocaleDateString()
                    : `${new Date(rd).toLocaleDateString()},`}
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
              !(isDeleting || request.status !== "Pending") && "btn-hovered"
            }`}
            onClick={() => handleDeleteRequest(request.r_id)}
            // Disable if submitting or if request has already been approved/denied
            disabled={isDeleting || request.status !== "Pending"}
          >
            Delete
          </button>
        </div>
      </div>
    ));

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (verifiedUser) {
        const requests = await getRequestsByUserUser(verifiedUser.u_id);

        if (isMounted) {
          setRequests(requests);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, [verifiedUser]);

  return (
    <div className="requests-container">
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div className="grid">
          {renderRequests()}
          {createNewRequest ? (
            renderNewRequest()
          ) : (
            <div className="mt-4 xs12 s10-offset-1 m8-offset-2 l6-offset-3 text-center">
              <button
                className="btn-lg btn-hovered"
                onClick={() => setCreateNewRequest(true)}
              >
                <p>New Request</p>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
