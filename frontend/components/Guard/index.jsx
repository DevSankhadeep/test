import { useState, useEffect } from "react";
import { http } from '../../modules/modules';
import Cookies from "universal-cookie"
import { Navigate, Outlet } from "react-router-dom"
import Loader from "../Loader";



export default function Guard({ endpoint, role }) {

    const cookies = new Cookies()
    const token = cookies.get("authToken")
    const [authorised, setAuthorised] = useState(false)
    const [loader, setLoader] = useState(true)
    const [userType, setUserType] = useState(null)

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const httpRequest = http(token);
                const { data } = await httpRequest.get(endpoint);
                const user = data?.data?.userType;

                sessionStorage.setItem("userInfo", JSON.stringify(data?.data));

                setUserType(user);
                setAuthorised(true);
            } catch {
                setUserType(null);
                setAuthorised(false);
            } finally {
                setLoader(false);
            }
        };

        verifyToken();
    }, [endpoint, token]);
        
    if (!token) {
        return <Navigate to="/" />;
    }

    if (loader) {
       return <Loader />
    }

    if (authorised && role === userType) {
        return <Outlet />
    }  else {
        return <Navigate to="/" />
    }
}



