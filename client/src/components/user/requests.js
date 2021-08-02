import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { UserContext } from '../../contexts/userContext';
import { isAuthenticated } from '../../services/auth';
import Loader from 'react-loader-spinner';
import { fetchRequestsByUser } from '../../services/requests';

export default function UserRequests() {
    const { verifiedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState(null);
    
    const handleDeleteRequest = () => {

    }

    const handleCreateRequest = () => {
        
    }

    useEffect(() => {
        async function getData() {
            if (verifiedUser) {
                const requests = await fetchRequestsByUser(verifiedUser.u_id);
                setRequests(requests);
                setIsLoading(false);
                console.log(`requests`, requests)
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
                        {
                            requests && requests.map((request, i) => (
                                <div key={i} className="border-solid-1 border-smooth w-50 lg-w-60 med-w-80 xs-w-90 text-center">
                                    <div className="grid xl-2-6fr sm-1-12fr">
                                        <div className="my-2">
                                            <strong>Submission date</strong>
                                            <p>{new Date(request.requested_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="my-2">
                                            <strong>Status</strong>
                                            <p>{request.status}</p>
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
                                        <button className="btn-sm btn-hovered">Delete</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
            }
        </div>
    )
}