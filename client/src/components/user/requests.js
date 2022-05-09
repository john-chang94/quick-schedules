import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../contexts/userContext";
import { isAuthenticated } from "../../services/auth";
import Loader from "react-loader-spinner";
import {
  createRequest,
  deleteRequest,
  getRequestsByUserUser,
} from "../../services/requests";
import { format } from "date-fns";
import { CSSTransition } from "react-transition-group";

export default function UserRequests() {
  const { verifiedUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState(null);
  const [notes, setNotes] = useState("");
  const [dates, setDates] = useState([]);
  // Keep track of the number of date values to determine
  // how many datepickers are rendered
  const [numOfDateInputs, setNumOfDateInputs] = useState(1);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const modalRef = useRef();

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
    if (!dates.length) {
      return alert("No dates selected");
    }

    const request = window.confirm("Submit request?");
    if (request) {
      setIsSubmitting(true);
      const tokenConfig = isAuthenticated();

      const body = {
        u_id: verifiedUser.u_id,
        requested_at: new Date(Date.now()),
        notes,
        requested_dates: dates,
      };

      // Create new request and refresh list
      await createRequest(body, tokenConfig);
      const requests = await getRequestsByUserUser(verifiedUser.u_id);

      setRequests(requests);
      setShowNewRequest(false);
      clearForm();
      setIsSubmitting(false);
    }
  };

  const handleCancelCreateNewRequest = () => {
    setShowNewRequest(false);
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

  // Format date to 'mm-dd-yyyy' without using new Date
  // Production fetches dates without timezone, while dev
  // fetches with timezone.. so manually parse date
  const handleFormatDate = (date) => {
    const init = date.split("T")[0];
    const split = init.split("-");
    const newDate = `${split[1]}-${split[2]}-${split[0]}`;
    return newDate;
  }

  // First datepicker
  // Does not include a delete button
  const DateElement = ({ index }) => (
    <div className="my-2">
      <p>Select date</p>
      <input
        type="date"
        value={dates[index] !== undefined && dates[index]}
        onChange={({ target }) => handleAddDate(index, target.value)}
      />
    </div>
  );

  // Additional datepickers
  const XDateElement = ({ index }) => (
    <div className="my-2">
      <p>Select date</p>
      <input
        type="date"
        value={dates[index] !== undefined && dates[index]}
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

  // Render datepickers based on numOfDateInputs
  const renderDateElements = () => {
    let dateElements = [];
    // Render based on number of values that are stored in dates array
    for (let i = 0; i < numOfDateInputs; i++) {
      if (numOfDateInputs > 1 && i === numOfDateInputs - 1) {
        // Render additional datepickers
        dateElements.push(<XDateElement key={i} index={i} />);
      } else {
        // Render initial datepicker
        dateElements.push(<DateElement key={i} index={i} />);
      }
    }

    // Return datepickers to render
    return dateElements;
  };

  const renderNewRequest = () => (
    <CSSTransition
      in={showNewRequest}
      timeout={300}
      classNames="modal-fade"
      unmountOnExit
      nodeRef={modalRef}
    >
      <div ref={modalRef}>
        <div // Dimmed overlay with active modal
          className="modal-container"
          onClick={() => setShowNewRequest(false)}
        ></div>
        <div className="modal" style={{ backgroundColor: "white" }}>
          <div className="my-2 flex flex-col align-center text-center">
            <div style={{ width: "175px" }}>
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
            <div style={{ width: "175px" }}>
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
        </div>
      </div>
    </CSSTransition>
  );

  // Render table layout in large view
  const renderRequests = () => (
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
        {requests.length
          ? requests.map((request, i) => (
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
                    className={`border-none ${
                      request.status === "Pending" && "pointer-no-u"
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

  const renderRequestsCards = () =>
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
    <div className="requests-container relative">
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div className="w-100">
          {renderNewRequest()}
          <div className="my-3 text-center">
            <button
              className="btn-lg btn-hovered"
              onClick={() => setShowNewRequest(true)}
            >
              <p>New Request</p>
            </button>
          </div>
          <div className="mt-5">
            {renderRequests()}
            <div className="requests-cards">{renderRequestsCards()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
