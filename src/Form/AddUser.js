import React, { useEffect, useState } from "react";
import '../Assets/Styles/AddUser.css'
import forBackground from '../Assets/Images/Mountain_Background.jpg'
import { useNavigate, useParams } from "react-router-dom";
import { validNames } from "./Regex";

const AddUser = () => {
    const navigate = useNavigate();
    const listOfroles = [
        { value: "Hr", label: "HR" },
        { value: "Developer", label: "Developer" },
        { value: "Tester", label: "Tester" },
        { value: "Analyst", label: "Analyst" },
        { value: "Manager", label: "Manager" }
    ]
    const { userid } = useParams();

    const [adduser, setAdduser] = useState({
        id: "",
        userid: "",
        username: "",
        gender: "",
        dob: "",
        role: ""
    })

    const [error, setError] = useState("")

    const getCurrentuser = JSON.parse(localStorage.getItem('Currentuser'))
    const getAllusers = JSON.parse(localStorage.getItem('Users'))

    useEffect(() => {
        if (userid && getCurrentuser?.users) {
            const user = getCurrentuser?.users?.find((user) => user.userid === userid)
            if (user) {
                setAdduser({
                    id: user.id || "",
                    userid: user.userid || "",
                    username: user.username || "",
                    gender: user.gender || "",
                    dob: user.dob || "",
                    role: user.role || ""
                })
            }
        }
    }, [userid, getCurrentuser?.users])


    const handleUsername = (e) => {
        setAdduser((prev) => ({
            ...prev,
            username: e.target.value
        }))
    }

    const handleGender = (e) => {
        setAdduser((prev) => ({
            ...prev,
            gender: e.target.value
        }))
    }

    const handleRole = (e) => {
        setAdduser((prev) => ({
            ...prev,
            role: e.target.value
        }))
    }

    const handleDob = (e) => {
        setAdduser((prev) => ({
            ...prev,
            dob: e.target.value
        }))
    }

    const handleSubmit = () => {

        if (!adduser.username) {
            setError("Please enter the username!")
        } else if (!adduser.gender) {
            setError("Please enter the gender!")
        } else if (!adduser.role) {
            setError("Please enter the role!")
        } else if (!adduser.dob) {
            setError("Please enter the dob!")
        } else if (validNames.test(adduser.username)) {
            setError("username is invalid")
        } else {
            const currentData = getCurrentuser?.users;
            const generateId = Date.now().toString();
            const newUser = {
                id: getCurrentuser.id,
                userid: generateId,
                username: adduser.username,
                gender: adduser.gender,
                dob: adduser.dob,
                role: adduser.role
            }
            currentData?.push(newUser)
            getCurrentuser.users = currentData
            localStorage.setItem('Currentuser', JSON.stringify(getCurrentuser))
            const allUsers = getAllusers.map((e) => {
                if (getCurrentuser.id === e.id) {
                    return e = getCurrentuser
                }
                return e;
            })
            localStorage.setItem('Users', JSON.stringify(allUsers))
            navigate('/dashboard')
        }
    }

    const handleUpdate = () => {
        const currentData = getCurrentuser?.users || [];
        const updatedData = currentData.map((user) => user.userid === userid ? adduser : user)
        getCurrentuser.users = updatedData
        localStorage.setItem('Currentuser', JSON.stringify(getCurrentuser))
        const updatedAll = getAllusers.map((user) => {
            if (getCurrentuser.id === user.id) {
                return user = getCurrentuser
            }
            return user;
        })
        localStorage.setItem('Users', JSON.stringify(updatedAll))
        navigate('/dashboard')
    }

    return (
        <div className="adduserPage" style={{ backgroundImage: `url(${forBackground})` }}>
            <div className="centerAlignment">
                <div className="adduserForm container1">
                    {userid ? <h1><b>Edit User</b></h1> : <h1><b>Add User</b></h1>}
                    <div className="userName">
                        <label>
                            Username </label>
                        <input type="text" name="username" style={{ width: '17em' }} value={adduser.username} onChange={handleUsername} />
                    </div>
                    <div className="gender" style={{ marginRight: '1.8em' }}>
                        <label>Gender </label>
                        <div style={{ width: '15em' }}>
                            <label>
                                <input type="radio" name="gender" value='Male' onChange={handleGender} checked={adduser.gender === 'Male'} />
                                Male
                            </label>
                            <label style={{ marginLeft: '5px' }}>
                                <input type="radio" name="gender" value='Female' onChange={handleGender} checked={adduser.gender === 'Female'} r />
                                Female
                            </label>
                            <label style={{ marginLeft: '5px' }}>
                                <input type="radio" name="gender" value='Others' onChange={handleGender} checked={adduser.gender === 'Others'} />
                                Others
                            </label>
                        </div>
                    </div>
                    <div className="dob">
                        <label> Date of Birth </label>
                        <input type="date" name="dob" value={adduser.dob} onChange={handleDob} style={{ width: '17em' }} required />
                    </div>
                    <div className="roleOfuser">
                        <label> Select a role </label>
                        <select className="dropdown" style={{ width: '17em' }} value={adduser.role} onClick={handleRole}>
                            <option disabled>Select one</option>
                            {listOfroles.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>{error}</div>
                    {userid ? <div className="submitDetails">
                        <button onClick={handleUpdate}>Submit</button>
                    </div> : <div className="submitDetails">
                        <button onClick={handleSubmit}>Submit</button>
                    </div>}
                </div>
            </div>
        </div>
    )
}
export default AddUser;