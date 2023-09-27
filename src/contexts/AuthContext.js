import { createContext, useContext, useEffect, useState } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import useLocalStorage from '@/hooks/useLocalStorage';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [roleId, setRoleId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(null);

    const [savedPin, setSavedPin] = useLocalStorage('HIVEPIN', '');

    const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();

    function login(pin) {
        return new Promise((resolve, reject) => {
            console.log('logging in');
            fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pin: pin
                })
            })
                .then((data) => data.json())
                .then((data) => {
                    setSavedPin(pin);
                    setRoleId(data.role);
                    setUserId(data.id);
                    setLoggedIn(true);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    function logout() {
        setSavedPin('');
        setRoleId(null);
        setUserId(null);
        setLoggedIn(false);
    }

    useEffect(() => {
        if (savedPin) {
            login(savedPin);
        }
    });

    const values = {
        login,
        logout,
        roleId,
        userId,
        isLoggedIn,
        onAuthOpen,
        isAuthOpen,
        onAuthClose
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
