import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { fetchAllRequests, updateRequestStatus } from '../../services/requests';
import Loader from 'react-loader-spinner';
import { isAuthenticated } from '../../services/auth';

export default function AdminRequests() {
    const [requests, setRequests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sortedBy, setSortedBy] = useState('All');

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
            <div>
                <Link to={ROUTES.ADMIN_HOME} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Home
                </Link>
            </div>

            <div className="text-center mt-4">
                <div className="flex justify-center">
                    <div className="flex justify-evenly w-9">
                        <button className="border-solid-1 border-oval px-5 py-1 bg-light-gray-hovered">All</button>
                        <button className="border-solid-1 border-oval px-5 py-1 bg-light-gray-hovered">Pending</button>
                        <button className="border-solid-1 border-oval px-5 py-1 bg-light-gray-hovered">Approved</button>
                        <button className="border-solid-1 border-oval px-5 py-1 bg-light-gray-hovered">Denied</button>
                    </div>
                </div>
                {
                    isLoading
                        ? <div className="text-center" style={{ marginTop: '70px' }}>
                            <Loader
                                type='Oval'
                                color='rgb(50, 110, 150)'
                            />
                        </div>
                        : <div className="mt-2 flex flex-col align-center">
                            {
                                requests && requests.map((request, r_i) => (
                                    <div key={r_i} className="my-2 border-solid-1 border-smooth box-shadow text-center w-50 lg-w-60 med-w-80 xs-w-90">
                                        <div className="my-2">
                                            <p><strong>Status</strong></p>
                                            <em className={request.status === 'Pending' ? 'blue' : request.status === 'Approved' ? 'green' : request.status === 'Denied' ? 'red' : ''}>{request.status}</em>
                                        </div>
                                        <div className="grid xl-2-6fr sm-1-12fr">
                                            <div className="my-2">
                                                <strong>{request.first_name} {request.last_name}</strong>
                                                <p>{request.title}</p>
                                            </div>
                                            <div className="my-2">
                                                <strong>Submission date</strong>
                                                <p>{new Date(request.requested_at).toDateString()}</p>
                                            </div>
                                            <div className="my-2">
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
                                            <div className="my-2 p-1">
                                                <strong>Notes</strong>
                                                <p>{request.notes}</p>
                                            </div>
                                        </div>
                                        <div className="my-3">
                                            <button
                                                className="btn-med btn-hovered pointer-no-u"
                                                onClick={() => handleUpdateRequestStatus(request.r_id, 'Approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-med btn-hovered ml-7 pointer-no-u"
                                                onClick={() => handleUpdateRequestStatus(request.r_id, 'Denied')}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                }
            </div>
        </div>
    )
}