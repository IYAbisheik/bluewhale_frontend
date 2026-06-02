import { Navigate, Outlet } from "react-router-dom";

const Privateroute = () => {
    const isAuthenticated = localStorage.getItem('isloggedIn') === "true";
    return isAuthenticated ? <Outlet/> : <Navigate to = "/" replace/> ;
}

export default Privateroute;