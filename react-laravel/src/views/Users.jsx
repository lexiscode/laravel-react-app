import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    // State variable to store the search query
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient.delete(`/users/${user.id}`).then(() => {
            setNotification("User was successfully deleted");
            // Redirect to /users route after successful deletion
            getUsers();
        });
    };

    const getUsers = () => {
        setLoading(true);

        axiosClient
            .get("/users")
            .then(({ data }) => {
                setLoading(false);
                // console.log(data)
                setUsers(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    // Updates the searchQuery state variable whenever the user types in the search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter users based on the search query
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">
                    Add new
                </Link>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* This displays the "loading" animation */}
                        {loading && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {/* This checks if the loading has stopped and if there's no data retrieved */}
                        {!loading && filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        {/* This checks if the loading has stopped and if there are data retrieved */}
                        {!loading &&
                            filteredUsers.length > 0 &&
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={"/users/" + user.id}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            className="btn-delete"
                                            onClick={() => onDeleteClick(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
