export default function EditAvailability({
  day,
  dayStart,
  dayEnd,
  setDayStart,
  setDayEnd,
  times,
  store,
}) {
  return (
    <div className="w-50 sm-w-70 text-center sm-x-center">
      <p className="mt-2">
        <strong>{day}</strong>
      </p>
      <div>
        <p>From</p>
        <select
          value={dayStart}
          onChange={({ target }) => setDayStart(target.value)}
        >
          <option value="ANY">ANY</option>
          <option value="N/A">N/A</option>
          {times &&
            times.map((time, i) => (
              <option
                key={i}
                value={time.time}
                disabled={
                  // Disable option if out of bounds of store operating hours
                  time.level < parseFloat(store.store_open_level) ||
                  time.level > parseFloat(store.store_close_level)
                }
              >
                {time.time}
              </option>
            ))}
        </select>
      </div>
      <div>
        <p>To</p>
        <select
          value={dayEnd}
          onChange={({ target }) => setDayEnd(target.value)}
        >
          <option value="ANY">ANY</option>
          <option value="N/A">N/A</option>
          {times &&
            times.map((time, i) => (
              <option
                key={i}
                value={time.time}
                disabled={
                  // Disable option if out of bounds of store operating hours
                  time.level < parseFloat(store.store_open_level) ||
                  time.level > parseFloat(store.store_close_level)
                }
              >
                {time.time}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
