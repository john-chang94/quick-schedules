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

    const handleUpdateRequestStatus = async (r_id, status) => {
        const update = window.confirm('Confirm decision?');
        if (update) {
            setIsUpdating(true);
            const tokenConfig = isAuthenticated();
    
            await updateRequestStatus(r_id, status, tokenConfig);
            setIsUpdating(false);
            // INCOMPLETE
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

            {
                isLoading
                    ? <div className="text-center" style={{ marginTop: '70px' }}>
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                        />
                    </div>
                    : requests && requests.map((request, r_i) => (
                        <div key={r_i}>
                            <div className="mx-2">
                                <p><strong>Status</strong></p>
                                <em>{request.status}</em>
                            </div>
                            <div className="mx-2">
                                <strong>{request.first_name} {request.last_name}</strong>
                                <p>{request.title}</p>
                            </div>
                            <div className="mx-2">
                                <strong>Submission date</strong>
                                <p>{new Date(request.requested_at).toDateString()}</p>
                            </div>
                            <div className="mx-2">
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
                            <div className="mx-2">
                                <strong>Notes</strong>
                                <p>{request.notes}</p>
                            </div>
                            <div className="mx-4">
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
                            <hr className="mx-4" />
                        </div>
                    ))
            }
        </div>
    )
}