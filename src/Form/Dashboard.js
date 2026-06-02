import React, { useState, useEffect } from "react";
import '../Assets/Styles/Dashboard.css'
import man from '../Assets/Images/man.png'
import others from '../Assets/Images/transgender.png'
import women from '../Assets/Images/woman.png'
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { toast } from "sonner";

const Dashboard = () => {

    const navigate = useNavigate();

    const [adminData, setAdminData] = useState([])
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const loggedUser = JSON.parse(localStorage.getItem('Currentuser'));
    const allUsers = JSON.parse(localStorage.getItem('Users'))

    const userData = loggedUser?.users;

    useEffect(() => {
        if (userData) {
            setAdminData(userData)
        }

        // Get current 2FA status
        if (loggedUser?.is2FAEnabled) {
            setIs2FAEnabled(true);
        }

    }, [])

    const handleLogout = () => {
        localStorage.removeItem('isloggedIn')
        localStorage.removeItem('Currentuser')
        toast.success("Logout successfully")
        navigate('/')
    }

    // Enable / Disable 2FA
    const handle2FA = () => {

        const updatedCurrentUser = {
            ...loggedUser,
            is2FAEnabled: !is2FAEnabled
        }

        // Update all users list
        const updatedAllUsers = allUsers.map((user) =>
            user.id === loggedUser.id
                ? updatedCurrentUser
                : user
        )

        // Save in localStorage
        localStorage.setItem(
            'Currentuser',
            JSON.stringify(updatedCurrentUser)
        )

        localStorage.setItem(
            'Users',
            JSON.stringify(updatedAllUsers)
        )

        setIs2FAEnabled(!is2FAEnabled)

        {
            !is2FAEnabled
                ? toast.success("2FA Enabled Successfully")
                : toast.error("2FA Disabled Successfully")
        }


    }

    const handleDelete = (userid) => {

        const updatedData = adminData.filter(
            (user) => userid !== user.userid
        )

        const updatedCurrent = {
            ...loggedUser,
            users: updatedData
        }

        const updatedAll = allUsers.map((user) =>
            user.id === loggedUser.id
                ? updatedCurrent
                : user
        );

        setAdminData(updatedData)

        localStorage.setItem(
            'Currentuser',
            JSON.stringify(updatedCurrent)
        )

        localStorage.setItem(
            'Users',
            JSON.stringify(updatedAll)
        )
    }

    const handleEdit = (userid) => {
        navigate(`/edituser/${userid}`)
    }

    return (
        <div className="dashboardPage">

            <div
                className="upperPart parts"
                style={{ marginTop: '10px' }}
            >

                <div className="adduserAndLogoutBtn">

                    <button
                        onClick={() => navigate('/adduser')}
                        className="adduserButton"
                    >
                        AddUser
                    </button>

                    {/* 2FA BUTTON */}
                    <div>
                        <button
                            onClick={handle2FA}
                            style={{
                                backgroundColor: is2FAEnabled ? 'orange' : '#0e5191',
                                color: 'white',
                                padding: '15px',
                                margin: '2em',
                            }}
                        >
                            {is2FAEnabled
                                ? 'Disable 2FA'
                                : 'Enable 2FA'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="logoutButton"
                        >
                            Logout
                        </button>
                    </div>

                </div>

                <div className="dashboardtexts">
                    <h2 style={{ fontWeight: '1000' }}>
                        DASHBOARD
                    </h2>

                    <h3>
                        Welcome {loggedUser?.firstname} {loggedUser?.lastname}!!!
                    </h3>

                </div>

            </div>

            <div
                className="lowerPart parts"
                style={{ marginBottom: '17px' }}
            >

                {loggedUser?.users?.length === 0 ? (
                    <h3 className="noRecordtext">
                        No record found!
                    </h3>
                ) : (
                    <div
                        className="cardData"
                        style={{
                            marginLeft: '10px',
                            marginRight: '10px'
                        }}
                    >

                        <Row xs={1} md={3} className="g-4">

                            {loggedUser?.users?.map((user, idx) => (

                                <Col key={idx}>

                                    <Card>

                                        <Card.Body>

                                            <button>

                                                {user.gender === 'Male' ? (
                                                    <Card.Img
                                                        src={man}
                                                        className="w-16 h-16 rounded-full mx-auto"
                                                    />
                                                ) : user.gender === 'Female' ? (
                                                    <Card.Img
                                                        src={women}
                                                        className="w-16 h-16 mx-auto"
                                                    />
                                                ) : (
                                                    <Card.Img
                                                        src={others}
                                                        className="w-16 h-16 mx-auto"
                                                    />
                                                )}

                                            </button>

                                            <Card.Title>
                                                {user?.username}
                                            </Card.Title>

                                            <Card.Title>
                                                {user?.gender}
                                            </Card.Title>

                                            <Card.Title>
                                                {user?.dob}
                                            </Card.Title>

                                            <Card.Title>
                                                {user?.role}
                                            </Card.Title>

                                            <div className="editAnddeleteBtn">

                                                <button
                                                    onClick={() => handleEdit(user.userid)}
                                                    style={{
                                                        backgroundColor: 'green',
                                                        color: 'white'
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(user.userid)}
                                                    style={{
                                                        backgroundColor: 'red',
                                                        color: 'white'
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </Card.Body>

                                    </Card>

                                </Col>

                            ))}

                        </Row>

                    </div>
                )}

            </div>

        </div>
    )
}

export default Dashboard;