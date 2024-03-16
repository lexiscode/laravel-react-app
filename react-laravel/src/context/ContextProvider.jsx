import { createContext, useContext, useState } from "react";

//  A new context named StateContext is created using createContext function
const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {}
})

export const ContextProvider = ({ children }) => {
    // State variables and setter functions using useState hook
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState("");
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

    // Custom setter function for notification with auto-clear feature
    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    // Custom setter function for token with local storage handling
    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    // Providing state and setter functions as context value
    return (
        <StateContext.Provider
            value={{
                user,
                token,
                notification,
                setUser,
                setToken,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext)
