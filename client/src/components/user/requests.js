import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { UserContext } from '../../contexts/userContext';
import { isAuthenticated } from '../../services/auth';
import Loader from 'react-loader-spinner';
import { deleteRequest, fetchRequestsByUser } from '../../services/requests';

export default function UserRequests() {
    const { verifiedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [createNew, setCreateNew] = useState(false);
    const [requests, setRequests] = useState(null);

    const [notes, setNotes] = useState('');
    const [dates, setDates] = useState([]);
    const [numOfDates, setNumOfDates] = useState(1);

    const handleDeleteRequest = async (r_id) => {
        const doDelete = window.confirm('Delete request?');
        if (doDelete) {
            setIsUpdating(true);

            const tokenConfig = isAuthenticated();
            await deleteRequest(r_id, tokenConfig);

            const requests = await fetchRequestsByUser(verifiedUser.u_id);
            setRequests(requests);
            setIsUpdating(false);
        }
    }

    const handleCreateRequest = () => {

    }

    useEffect(() => {
        console.log(`dates`, dates)
    }, [dates])

    const handleModifyDatesArray = (index, newDate) => {
        if (dates[index] !== undefined) {
            let arrCopy = dates;
            let removed = arrCopy.splice(index, 1, newDate);
            setDates(arrCopy);
        }
        else {
            setDates([...dates, newDate]);
        }
    }

    const DateElement = ({ index, dates }) => {
        return (
        <div className="my-2">
            <p>Select date</p>
            <input type="date" value={dates[index] !== undefined ? dates[index] : ''} onChange={({ target }) => handleModifyDatesArray(index, target.value)} />
        </div>
        )
    }

    const XDateElement = ({ index, dates }) => (
        <div className="my-2">
            <p>Select date</p>
            <input type="date" value={dates[index] !== undefined ? dates[index] : ''} onChange={({ target }) => handleModifyDatesArray(index, target.value)} />
            <button className="btn-sm btn-hovered mt-2" onClick={() => setNumOfDates(numOfDates - 1)}>
                <i className="fas fa-minus"></i>&nbsp;Date
            </button>
        </div>
    )

    const renderDateElements = ({ dates }) => {
        let items = [];
        for (let i = 0; i < numOfDates; i++) {
            if (numOfDates > 1 && i === numOfDates - 1) {
                items.push(<XDateElement key={i} index={i} dates={dates} />)
            } else {
                items.push(<DateElement key={i} index={i} dates={dates} />)
            }
        }

        return items;
    }

    const renderRequests = () => (
        <div className="flex flex-col align-center">
            {
                requests && requests.map((request, i) => (
                    <div key={i} className="border-solid-1 border-smooth p-1 w-50 lg-w-60 med-w-80 xs-w-90 text-center">
                        <div className="grid xl-2-6fr sm-1-12fr">
                            <div className="my-2">
                                <strong>Submission date</strong>
                                <p>{new Date(request.requested_at).toLocaleDateString()}</p>
                            </div>
                            <div className="my-2">
                                <p><strong>Status</strong></p>
                                <em
                                    className={
                                        request.status === 'Pending'
                                            ? 'blue'
                                            : request.status === 'Approved'
                                                ? 'green'
                                                : request.status === 'Denied'
                                                    ? 'red'
                                                    : ''}>
                                    {request.status}
                                </em>
                            </div>
                            <div className="my-2">
                                <strong>Requested dates</strong>
                                {
                                    request.requested_dates.map((rd, rd_i) => (
                                        <p key={rd_i}>
                                            {
                                                rd_i === request.requested_dates.length - 1
                                                    ? new Date(rd).toDateString()
                                                    : `${new Date(rd).toDateString()},`
                                            }
                                        </p>
                                    ))
                                }
                            </div>
                            <div className="my-2">
                                <strong>Notes</strong>
                                <p>{request.notes}</p>
                            </div>
                        </div>
                        <div className="my-2">
                            <button
                                className="btn-sm btn-hovered"
                                onClick={() => handleDeleteRequest(request.r_id)}
                                disabled={isUpdating}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            }
            {
                createNew
                    ? <div className="border-solid-1 border-smooth p-1 w-50 lg-w-60 med-w-80 xs-w-90 mt-5 flex flex-col align-center">
                        <div className="w-3 text-center">
                            {renderDateElements(dates)}
                            <button className="btn-sm btn-hovered mb-2" onClick={() => setNumOfDates(numOfDates + 1)}>
                                <i className="fas fa-plus"></i>&nbsp;Date
                            </button>
                        </div>
                        <div>
                            <button className="btn-sm btn-hovered">Submit</button>
                            <button className="btn-sm btn-hovered" onClick={() => setCreateNew(false)}>Cancel</button>
                        </div>
                    </div>
                    : <div className="mt-5">
                        <button className="btn-lg btn-hovered" onClick={() => setCreateNew(true)}>
                            <p><i className="fas fa-plus"></i> New Request</p>
                        </button>
                    </div>
            }

        </div>
    )

    useEffect(() => {
        async function getData() {
            if (verifiedUser) {
                const requests = await fetchRequestsByUser(verifiedUser.u_id);
                setRequests(requests);
                setIsLoading(false);
            }
        }

        getData();
    }, [verifiedUser])

    return (
        <div>
            <div>
                <Link to={ROUTES.USER_HOME} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Home
                </Link>
            </div>
            {
                isLoading
                    ? <div className="text-center" style={{ marginTop: '70px' }}>
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                        />
                    </div>
                    : <div>
                        {renderRequests()}
                    </div>
            }
        </div>
    )
}