import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function GuestLayout() {
    const { token } = useStateContext();
    // if trying to access any of the children of the GuestLayout route with a token (which means you are logged in),
    // then it means you shouldn't be able to access the signup and login routes, then redirect back to / (i.e. /users)  route
    if (token) {
        return <Navigate to="/" />;
    }

    return (
        // since the two divs appear in both Login and SignUp codes, then we can just apply it once here
        // in the GuestLayout, while the <Outlet/> takes their separate designs
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <Outlet />
            </div>
        </div>
    );
}

