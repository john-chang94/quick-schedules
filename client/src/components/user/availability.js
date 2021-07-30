import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { UserContext } from '../../contexts/userContext';
import { isAuthenticated } from '../../services/auth';
import Loader from 'react-loader-spinner';
import { fetchUserAvailability } from '../../services/users';
import { fetchTimes } from '../../services/presets';

export default function UserAvailability() {
    const { verifiedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [showEditAvailability, setShowEditAvailability] = useState(false);

    const [availability, setAvailability] = useState(null);
    const [times, setTimes] = useState(null);

    const handleShowEditAvailability = () => {

    }

    const renderAvailability = () => (
        <div className="flex flex-col align-center mt-4">
            <div className="border-solid-1 border-smooth w-50 lg-w-60 med-w-80 xs-w-90">
                <div>
                    {
                        availability && availability.avail.map((avail, i) => (
                            <div key={i} className="text-center my-2">
                                <p className="my-1"><strong>{avail.day}</strong></p>
                                <p>{avail.time}</p>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <button className="btn-sm" onClick={handleShowEditAvailability}>Edit</button>
                </div>
            </div>
        </div>
    )

    const renderEditAvailability = () => (
        <div>
            <div>
                <select>
                    {
                        times && times.map((time, i) => (
                            <option key={i}>{time.time}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )

    useEffect(() => {
        async function getData() {
            if (verifiedUser) {
                const availability = await fetchUserAvailability(verifiedUser.u_id);
                const times = await fetchTimes();

                setAvailability(availability);
                setTimes(times);
                setIsLoading(false);
                console.log(`availability`, availability)
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
                    : <>
                        {
                            showEditAvailability
                                ? renderEditAvailability()
                                : renderAvailability()
                        }
                    </>
            }
        </div>
    )
}