import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { fetchAllRequestsByStatus, fetchAllRequests, updateRequestStatus } from '../../services/requests';
import Loader from 'react-loader-spinner';
import { isAuthenticated } from '../../services/auth';
import { format } from 'date-fns';

export default function AdminRequests() {
    const [requests, setRequests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState('All');

    const handleUpdateRequestStatus = async (r_id, status) => {
        const update = window.confirm('Confirm decision?');
        if (update) {
            setIsUpdating(true);
            const tokenConfig = isAuthenticated();
            const body = { status };

            await updateRequestStatus(r_id, body, tokenConfig);
            const requests = await fetchAllRequests();

            setRequests(requests);
            setIsUpdating(false);
        }
    }

    const handleSortRequests = async (status) => {
        setIsLoading(true);
        if (status === 'All') {
            const requests = await fetchAllRequests();
            setRequests(requests);
            setStatus(status);
            setIsLoading(false);
        } else {
            const requests = await fetchAllRequestsByStatus(status);
            setRequests(requests);
            setStatus(status);
            setIsLoading(false);
        }
    }

    const renderFilters = () => (
        <div className="flex flex-col align-center">
            <p className="mb-2">View by</p>
            <div className="w-50 lg-w-60 med-w-80 xs-w-90 grid2">
                <button
                    className={`border-solid-1 border-oval pointer-no-u py-1 hovered s6 l3
                        ${status === 'All' && 'bg-light-gray'}`}
                    onClick={() => handleSortRequests('All')}
                >
                    All
                </button>
                <button
                    className={`border-solid-1 border-oval pointer-no-u py-1 hovered s6 l3
                        ${status === 'Pending' && 'bg-light-gray'}`}
                    onClick={() => handleSortRequests('Pending')}
                >
                    Pending
                </button>
                <button
                    className={`border-solid-1 border-oval pointer-no-u py-1 hovered s6 l3
                        ${status === 'Approved' && 'bg-light-gray'}`}
                    onClick={() => handleSortRequests('Approved')}
                >
                    Approved
                </button>
                <button
                    className={`border-solid-1 border-oval pointer-no-u py-1 hovered s6 l3
                        ${status === 'Denied' && 'bg-light-gray'}`}
                    onClick={() => handleSortRequests('Denied')}
                >
                    Denied
                </button>
            </div>
        </div>
    )

    const renderRequests2 = () => (
        <table className="border-collapse w-100 requests-table">
            <thead>
                <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Requested Dates</th>
                    <th className="p-2">Notes</th>
                    <th className="p-2">Submission Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Edit</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((request, i) => (
                    <tr
                        key={i}
                        style={i % 2 === 0
                        ? { backgroundColor: 'rgb(240, 240, 240)' }
                        : { backgroundColor: 'rbg(255, 255, 255)' }}
                    >
                        <td className="p-2">
                            {request.first_name} {request.last_name} <br />
                            <em className="text-3">{request.title}</em>
                        </td>
                        <td className="p-2">{request.requested_dates.map((rd, rd_i) => (
                            <span key={rd_i}>
                                {
                                // Add commas if more than one date
                                rd_i === request.requested_dates.length - 1
                                    ? format(new Date(rd), "MM-dd-yyyy")
                                    : `${format(new Date(rd), "MM-dd-yyyy")}, `
                                }
                            </span>
                        ))}</td>
                        <td className="p-2">{request.notes}</td>
                        <td className="p-2 text-center">{format(new Date(request.requested_at), "MM-dd-yyyy")}</td>
                        <td className={
                                    request.status === 'Pending'
                                        ? 'blue p-2 text-center'
                                        : request.status === 'Approved'
                                            ? 'green p-2 text-center'
                                            : request.status === 'Denied'
                                                ? 'red p-2 text-center'
                                                : ''}>
                            {request.status}
                            </td>
                        <td className="p-2 text-center">
                            <button
                                className={`btn-sm my-1 mx-2 ${isUpdating ? '' : 'btn-hovered pointer-no-u'}`}
                                onClick={() => handleUpdateRequestStatus(request.r_id, 'Approved')}
                                disabled={isUpdating}
                            >
                                Approve
                            </button>
                            <button
                                className={`btn-sm my-1 ${isUpdating ? '' : 'btn-hovered pointer-no-u'}`}
                                onClick={() => handleUpdateRequestStatus(request.r_id, 'Denied')}
                                disabled={isUpdating}
                            >
                                Deny
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

    const renderRequests = () => (
        <div className="mt-2 grid2">
            {requests.length ? requests.map((request, r_i) => (
                    <div key={r_i} className="my-2 p-1 border-solid-1 border-smooth box-shadow flex flex-col align-center text-center xs12 s10-offset-1 m8-offset-2 l6-offset-3">
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
                        <div className="w-100 grid2">
                            <div className="my-1 s12 l6">
                                <strong>{request.first_name} {request.last_name}</strong>
                                <p>{request.title}</p>
                            </div>
                            <div className="my-1 s12 l6">
                                <strong>Submission date</strong>
                                <p>{new Date(request.requested_at).toDateString()}</p>
                            </div>
                            <div className="my-1 s12 l6">
                                <strong>Requested dates</strong>
                                {
                                    request.requested_dates.map((rd, rd_i) => (
                                        <p key={rd_i}>
                                            {
                                                // Add commas if more than one date
                                                rd_i === request.requested_dates.length - 1
                                                    ? new Date(rd).toDateString()
                                                    : `${new Date(rd).toDateString()},`
                                            }
                                        </p>
                                    ))
                                }
                            </div>
                            <div className="my-1 s12 l6">
                                <strong>Notes</strong>
                                <p>{request.notes}</p>
                            </div>
                        </div>
                        <div>
                            <button
                                className={`btn-med m-2 ${isUpdating ? '' : 'btn-hovered pointer-no-u'}`}
                                onClick={() => handleUpdateRequestStatus(request.r_id, 'Approved')}
                                disabled={isUpdating}
                            >
                                Approve
                            </button>
                            <button
                                className={`btn-med m-2 ${isUpdating ? '' : 'btn-hovered pointer-no-u'}`}
                                onClick={() => handleUpdateRequestStatus(request.r_id, 'Denied')}
                                disabled={isUpdating}
                            >
                                Deny
                            </button>
                        </div>
                    </div>
                ))
                    : (
                        <p className="l2-offset-5 text-center mt-3">
                            None
                        </p>
                    )
            }
        </div>
    )

    useEffect(() => {
        async function getRequests() {
            const requests = await fetchAllRequests();
            setRequests(requests);
            setIsLoading(false);
        }

        getRequests();
    }, [])

    return (
        <div>
            <div className="mt-4">
                {renderFilters()}
                {isLoading ? (
                        <div className="text-center" style={{ marginTop: '70px' }}>
                            <Loader
                                type='Oval'
                                color='rgb(50, 110, 150)'
                            />
                        </div>
                    ) : (
                        <div>
                            {renderRequests2()}
                            <div className="requests-cards">
                                {renderRequests()}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}