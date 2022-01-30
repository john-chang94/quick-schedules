import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { UserContext } from '../../contexts/userContext';
import { isAuthenticated } from '../../services/auth';
import Loader from 'react-loader-spinner';
import { createRequest, deleteRequest, fetchRequestsByUser } from '../../services/requests';
import { format } from 'date-fns';

export default function UserRequests() {
    const { verifiedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createNewRequest, setCreateNewRequest] = useState(false);
    const [requests, setRequests] = useState(null);

    const [notes, setNotes] = useState('');
    const [dates, setDates] = useState([]);
    const [didUpdate, setDidUpdate] = useState(false); // Used to refresh date inputs after selection
    const [numOfDateInputs, setNumOfDateInputs] = useState(1);

    const handleDeleteRequest = async (r_id) => {
        const doDelete = window.confirm('Delete request?');
        if (doDelete) {
            setIsDeleting(true);

            const tokenConfig = isAuthenticated();
            await deleteRequest(r_id, tokenConfig);

            const requests = await fetchRequestsByUser(verifiedUser.u_id);
            setRequests(requests);
            setIsDeleting(false);
        }
    }

    const handleCreateRequest = async () => {
        const request = window.confirm('Submit request?');
        if (request) {
            setIsSubmitting(true);
            const tokenConfig = isAuthenticated();
            let datesArr = dates;

            for (let i = 0; i < datesArr.length; i++) {
                datesArr[i] = new Date(datesArr[i]).toISOString();
            }

            const body = {
                u_id: verifiedUser.u_id,
                requested_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
                notes,
                requested_dates: datesArr
            }

            await createRequest(body, tokenConfig);
            const requests = await fetchRequestsByUser(verifiedUser.u_id);

            setRequests(requests);
            setCreateNewRequest(false);
            clearForm();
            setIsSubmitting(false);
        }
    }

    const handleCancelCreateNewRequest = () => {
        setCreateNewRequest(false);
        clearForm();
    }

    const clearForm = () => {
        setNumOfDateInputs(1);
        setDates([]);
        setNotes('');
    }

    const handleAddDate = (index, newDate) => {
        if (dates[index] !== undefined) {
            let arrCopy = dates;
            // eslint-disable-next-line
            // let removed = dates.splice(index, 1, newDate); // Replace old date with selected date
            arrCopy.push(newDate)
            setDates(arrCopy);
            setDidUpdate(!didUpdate); // Refresh date input values
        }
        else {
            setDates([...dates, newDate]);
        }
    }

    const handleRemoveDate = (index) => {
        let arrCopy = dates;
        // eslint-disable-next-line
        let removed = arrCopy.splice(index, 1); // Remove selected date from dates array
        // let removed = arrCopy.pop();
        setDates(arrCopy);
        setNumOfDateInputs(numOfDateInputs - 1);
    }

    // First date input
    const DateElement = ({ index }) => {
        return (
            <div className="my-2">
                <p>Select date</p>
                <input
                    type="date"
                    value={dates[index] !== undefined ? dates[index] : ''}
                    onChange={({ target }) => handleAddDate(index, target.value)}
                />
            </div>
        )
    }

    // Additional date inputs
    const XDateElement = ({ index }) => {
        return (
            <div className="my-2">
                <p>Select date</p>
                <input
                    type="date"
                    value={dates[index] !== undefined ? dates[index] : ''}
                    onChange={({ target }) => handleAddDate(index, target.value)}
                />
                <button className="btn-sm btn-hovered mt-2" onClick={() => handleRemoveDate(index)}>
                    <i className="fas fa-minus"></i>&nbsp;Date
                </button>
            </div>
        )
    }

    // Render date inputs based on numOfDateInputs
    const renderDateElements = () => {
        let dateElements = [];
        for (let i = 0; i < numOfDateInputs; i++) {
            if (numOfDateInputs > 1 && i === numOfDateInputs - 1) {
                dateElements.push(<XDateElement key={i} index={i} />)
            } else {
                dateElements.push(<DateElement key={i} index={i} />)
            }
        }

        return dateElements; // Return date inputs to render
    }

    const renderNewRequest = () => (
        <div className="border-solid-1 border-smooth p-1 w-50 lg-w-60 med-w-80 xs-w-90 mt-5 flex flex-col align-center text-center">
            <div className="w-3">
                {
                    // Render custom date elements and functions from above
                    renderDateElements()
                }
                <button
                    className={`btn-sm mb-2 ${dates.length === numOfDateInputs && 'btn-hovered'}`}
                    disabled={dates.length !== numOfDateInputs} // Disable if next date is not yet selected
                    onClick={() => setNumOfDateInputs(numOfDateInputs + 1)}
                >
                    <i className="fas fa-plus"></i>&nbsp;Date
                </button>
            </div>
            <div className="w-50 lg-w-60 med-w-80 xs-w-90 my-1">
                <p>Notes</p>
                <textarea className="h-10 w-90 p-1" onChange={({ target }) => setNotes(target.value)}></textarea>
            </div>
            <div className="my-2 w-50 lg-w-60 med-w-80 xs-w-90 flex justify-evenly">
                <button className="btn-sm btn-hovered" disabled={isSubmitting} onClick={() => handleCreateRequest()}>Submit</button>
                <button className="btn-sm btn-hovered" disabled={isSubmitting} onClick={() => handleCancelCreateNewRequest()}>Cancel</button>
            </div>
        </div>
    )

    const renderRequests = () => (
        requests && requests.map((request, i) => (
            <div key={i} className="border-solid-1 border-smooth p-1 w-50 lg-w-60 med-w-80 xs-w-90 text-center my-2">
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
                        disabled={isDeleting}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))
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
                    : <div className="flex flex-col align-center">
                        {renderRequests()}
                        {
                            createNewRequest
                                ? renderNewRequest()
                                : <div className="mt-5">
                                    <button className="btn-lg btn-hovered" onClick={() => setCreateNewRequest(true)}>
                                        <p><i className="fas fa-plus"></i> New Request</p>
                                    </button>
                                </div>
                        }
                    </div>
            }
        </div>
    )
}