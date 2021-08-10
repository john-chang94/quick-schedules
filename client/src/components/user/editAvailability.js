export default function EditAvailability({ dayStart, dayEnd, setDayStart, setDayEnd, times, store }) {
    return (
        <div className="flex justify-center justify-evenly">
            <div>
                <p>From</p>
                <select value={dayStart} onChange={({ target }) => setDayStart(target.value)}>
                    <option value="ANY">ANY</option>
                    <option value="N/A">N/A</option>
                    {
                        times && times.map((time, i) => (
                            <option
                                key={i}
                                value={time.time}
                                disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                            >
                                {time.time}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div>
                <p>To</p>
                <select value={dayEnd} onChange={({ target }) => setDayEnd(target.value)}>
                    <option value="ANY">ANY</option>
                    <option value="N/A">N/A</option>
                    {
                        times && times.map((time, i) => (
                            <option
                                key={i}
                                value={time.time}
                                disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                            >
                                {time.time}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}