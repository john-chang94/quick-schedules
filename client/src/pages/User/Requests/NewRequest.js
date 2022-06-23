import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { isAuthenticated } from "../../../services/auth";
import { createRequest, getRequesetsByUser } from "../../../services/requests";

export const NewRequest = ({ state, dispatch, verifiedUser }) => {
  const [notes, setNotes] = useState("");
  const [dates, setDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Keep track of the number of date values to determine
  // how many datepickers are rendered
  const [numOfDateInputs, setNumOfDateInputs] = useState(1);
  const modalRef = useRef();

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
      const requests = await getRequesetsByUser(verifiedUser.u_id);

      dispatch({
        type: "SET_ANY",
        payload: {
          requests,
          showNewRequest: false,
        },
      });
      setNumOfDateInputs(1);
      setDates([]);
      setNotes("");
      setIsSubmitting(false);
    }
  };

  const handleCancelCreateNewRequest = () => {
    dispatch({ type: "TOGGLE_NEW_REQUEST" });
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

  // Render datepickers based on dates array length
  const renderDateElements = () => {
    let dateElements = [];
    for (let i = 0; i < numOfDateInputs; i++) {
      if (numOfDateInputs > 1 && i === numOfDateInputs - 1) {
        // Render additional datepickers
        dateElements.push(<XDateElement key={i} index={i} />);
      } else {
        // Render initial datepicker
        dateElements.push(<DateElement key={i} index={i} />);
      }
    }

    return dateElements;
  };

  return (
    <CSSTransition
      in={state.showNewRequest}
      timeout={300}
      classNames="modal-fade"
      unmountOnExit
      nodeRef={modalRef}
    >
      <div ref={modalRef}>
        <div // Dimmed overlay with active modal
          className="modal-container"
          onClick={() => dispatch({ type: "TOGGLE_NEW_REQUEST" })}
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
                className="btn-md btn-hovered m-3"
                disabled={isSubmitting}
                onClick={() => handleCreateRequest()}
              >
                Submit
              </button>
              <button
                className="btn-md btn-hovered m-3"
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
};
