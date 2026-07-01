import { useQuery } from "@apollo/client/react";
import { GET_USERS } from "../queries";

function Users() {
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading){
       return <p>Loading...</p>; 
    } 
    if (error){
        return <p>{error.message}</p>;
    } 

    console.log("LINE10", loading, error, data);
    
    return (
        <>
            {data.getUsers.map((user) => (
                <div key={user.id}>
                    {user.name}
                </div>
            ))}
        </>
    );
}

export default Users;