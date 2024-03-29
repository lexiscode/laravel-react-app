import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useState } from "react";
import LoadingBar from "react-loading-bar";
import "react-loading-bar/dist/index.css";

export default function Login() {
    const emailRef = createRef();
    const passwordRef = createRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);

    // create a state variable to track whether the login process is in progress
    const [loading, setLoading] = useState(false);
    // create a state variable to disable login button
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        setLoading(true); // Set loading state to true
        setButtonDisabled(true); // Disable login button

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);

        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            })

            .finally(() => {
                setLoading(false); // Set loading state to false after request completes
                setButtonDisabled(false); // Enable login button after request completes
            });
    };

    return (
        <form onSubmit={onSubmit}>
            <h1 className="title">Login</h1>

            {errors && (
                <div className="alert">
                    {Object.keys(errors).map((key) => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            )}

            <input ref={emailRef} type="email" placeholder="Email" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <button
                className={`btn btn-block ${buttonDisabled ? "disabled" : ""}`}
                disabled={buttonDisabled}
            >
                {loading ? (
                    <div className="loader"></div> // Loader animation
                ) : (
                    "Login"
                )}
            </button>
            <p className="message">
                Not registered? <Link to="/signup">Create an account</Link>
            </p>

            <LoadingBar // Render the loading bar
                show={loading}
                color="blue"
                waitingTime={500} // Optional: Specify a waiting time before displaying the progress bar
            />
        </form>
    );
}

