import { useNavigate } from "react-router-dom";

const Errorpage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isloggedIn')
        localStorage.removeItem('Currentuser')
        navigate('/')
    }
    return(
        <div>
            <h1>Something went wrong in your application</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
export default Errorpage;