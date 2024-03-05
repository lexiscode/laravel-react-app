import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect } from "react";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken } = useStateContext();

    // if trying to access any of the children of the DefaultLayout route without a token, redirect
    // them to the login route (all routes within DefaultLayout can only be viewed when user is logged in)
    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = (e) => {
        e.preventDefault();

        axiosClient.post("/logout")
            .then(() => {
                setUser({});
                setToken(null);
        });
    };

    // this makes the name of logged in user to display in the dashboard
    useEffect(() => {
        axiosClient.get("/user")
            .then(({ data }) => {
                setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>

            <div className="content">
                <header>
                    <div>Header</div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

            {/* this displays all notification at the bottom in our admin panel */}
            {notification && <div className="notification">{notification}</div>}
        </div>
    );
}
