import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react"
import axiosClient from "../axios-client.js"
import { useStateContext } from "../context/ContextProvider.jsx"

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const navigate = useNavigate(); // its usage is commented in the onSubmit function

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };
        // console.log(payload);
        axiosClient.post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user); // setUser(null); if you don't want autologin
                setToken(data.token); // setToken(null); if you don't want autologin
                // navigate("/login"); //redirect to login page, if you don't want autologin
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <form onSubmit={onSubmit}>
            <h1 className="title">Create an Account</h1>

            {errors && (
                <div className="alert">
                    {Object.keys(errors).map((key) => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            )}

            <input ref={nameRef} type="text" placeholder="Full Name" />
            <input ref={emailRef} type="email" placeholder="Email Address" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <input
                ref={passwordConfirmationRef}
                type="password"
                placeholder="Repeat Password"
            />
            <button className="btn btn-block">Register</button>
            <p className="message">
                Already registered?
                <Link to="/login"> Sign in</Link>
            </p>
        </form>
    );
}
