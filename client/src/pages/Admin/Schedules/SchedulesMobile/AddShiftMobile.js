import React from "react";
import { CSSTransition } from "react-transition-group";

export const AddShiftMobile = ({
  modalRef,
  users,
  presets,
  times,
  store,
  u_id,
  isUpdating,
  setDate,
  setUId,
  shiftStartValue,
  shiftEndValue,
  setShiftStartValue,
  setShiftEndValue,
  showAddShift,
  setShowAddShift,
  handleSelectPreset,
  handleCancelAddShift,
  handleCreateShift,
  handleShowAddShift,
  error
}) => {
  return (
    <>
      <CSSTransition
        in={showAddShift}
        timeout={300}
        classNames="modal-fade"
        unmountOnExit
        nodeRef={modalRef}
      >
        <div ref={modalRef}>
          <div // Dimmed overlay with active modal
            className="modal-container"
            onClick={() => setShowAddShift(false)}
          ></div>
          <div className="modal">
            <div className="p-3">
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Date</p>
                <input
                  type="date"
                  onChange={({ target }) => setDate(target.value)}
                />
              </div>
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Employee</p>
                <select onChange={({ target }) => setUId(target.value)}>
                  <option value="">Select...</option>
                  {users.map((user, i) => (
                    <option key={i} value={user.u_id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Preset</p>
                <select
                  defaultValue="0 0"
                  disabled={isUpdating}
                  onChange={({ target }) => handleSelectPreset(target.value)}
                >
                  <option value="">Select</option>
                  {presets &&
                    presets.map((preset, i) => (
                      <option
                        key={i}
                        value={`${preset.shift_start_value}-${preset.shift_end_value}`}
                      >
                        {preset.shift_start} - {preset.shift_end}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Start</p>
                <select
                  value={shiftStartValue}
                  disabled={isUpdating}
                  onChange={({ target }) => setShiftStartValue(target.value)}
                >
                  {times &&
                    times.map((time, i) => (
                      <option
                        key={i}
                        value={time.value}
                        disabled={
                          time.level < parseFloat(store.store_open_level) ||
                          time.level > parseFloat(store.store_close_level)
                        }
                      >
                        {time.time}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">End</p>
                <select
                  value={shiftEndValue}
                  disabled={isUpdating}
                  onChange={({ target }) => setShiftEndValue(target.value)}
                >
                  {times &&
                    times.map((time, i) => (
                      <option
                        key={i}
                        value={time.value}
                        disabled={
                          time.level < parseFloat(store.store_open_level) ||
                          time.level > parseFloat(store.store_close_level)
                        }
                      >
                        {time.time}
                      </option>
                    ))}
                </select>
              </div>
              {error && <p className="red schedules-mobile-text">{error}</p>}
              <div className="mt-1">
                <button
                  className="btn-md hovered m-1 bg-white"
                  onClick={() => handleCreateShift(u_id)}
                >
                  Save
                </button>
                <button
                  className="btn-md hovered m-1 bg-white"
                  onClick={handleCancelAddShift}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
      {!showAddShift && (
        // Hide add button when modal is active
        <div
          className="add-shift-btn flex flex-center pointer"
          onClick={handleShowAddShift}
        >
          <p className="white text-7">
            <i className="fas fa-plus" />
          </p>
        </div>
      )}
    </>
  );
};
