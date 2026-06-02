import { Navigate, Outlet } from "react-router-dom";

const PublicRouter = () => {
    const isAuthenticated =localStorage.getItem("isloggedIn") === "true";
    return isAuthenticated ? <Navigate to="/dashboard" replace/> : <Outlet/>;
}

export default PublicRouter