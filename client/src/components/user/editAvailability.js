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
    <div className="w-100 text-center">
      <p className="mt-2">{day}</p>
      <div className="grid">
        <div className="xs5-offset-1 s4-offset-2 l4-offset-2">
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
                  disabled={ // Disable option if out of bounds of store operating hours
                    time.level < parseFloat(store.store_open_level) ||
                    time.level > parseFloat(store.store_close_level)
                  }
                >
                  {time.time}
                </option>
              ))}
          </select>
        </div>
        <div className="xs5 s4 l4">
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
                  disabled={ // Disable option if out of bounds of store operating hours
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
    </div>
  );
}
