import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/user/userslice";
import { loggedUser } from "../utils/utils";

const Profile = () => {
    const [data, setData] = useState()

    useEffect(() => {
        const userData = getCurrentUser(loggedUser?.id)
        setData(userData)
    }, [])

    console.log("LINE13", data);
    
    return(
        <div>

        </div>
    )
}

export default Profile;