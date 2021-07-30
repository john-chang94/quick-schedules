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

    // const [monStart, setMonStart] = useState('');
    // const [monEnd, setMonEnd] = useState('');
    // const [tueStart, setTueStart] = useState('');
    // const [tueEnd, setTueEnd] = useState('');
    // const [wedStart, setWedStart] = useState('');
    // const [wedEnd, setWedEnd] = useState('');
    // const [thurStart, setThurStart] = useState('');
    // const [thurEnd, setThurEnd] = useState('');
    // const [friStart, setFriStart] = useState('');
    // const [friEnd, setFriEnd] = useState('');
    // const [satStart, setSatStart] = useState('');
    // const [satEnd, setSatEnd] = useState('');
    // const [sunStart, setSunStart] = useState('');
    // const [sunEnd, setSunEnd] = useState('');

    // const handleShowEditAvailability = (day, time) => {
    //     let avail = availability.avail;

    //     for (let i = 0; i < avail.length; i++) {
    //         if (avail[i].time === 'OPEN') {

    //         }
    //     }
    //     switch (day) {
    //         case 'Monday':
    //             setMonStart(time.split('-')[0].trim());
    //             setMonEnd(time.split('-')[1].trim());
    //         case 'Tuesday':
    //             setTueStart(time.split('-')[0].trim());
    //             setTueEnd(time.split('-')[1].trim());
    //         case 'Wednesday':
    //             setWedStart(time.split('-')[0].trim());
    //             setWedEnd(time.split('-')[1].trim());
    //         case 'Thursday':
    //             setThurStart(time.split('-')[0].trim());
    //             setThurEnd(time.split('-')[1].trim());
    //         case 'Friday':
    //             setFriStart(time.split('-')[0].trim());
    //             setFriEnd(time.split('-')[1].trim());
    //         case 'Saturday':
    //             setSatStart(time.split('-')[0].trim());
    //             setSatEnd(time.split('-')[1].trim());
    //         case 'Sunday':
    //             setSunStart(time.split('-')[0].trim());
    //             setSunEnd(time.split('-')[1].trim());
    //         default:
    //             return;
    //     }
    // }

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
                    {/* <button className="btn-sm" onClick={handleShowEditAvailability}>Edit</button> */}
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