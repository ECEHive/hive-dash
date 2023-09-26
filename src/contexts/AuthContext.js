import { createContext, useContext, useState } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import AuthModal from '@/components/AuthModal';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [roleId, setRoleId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(null);

    const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();

    function login(pin) {
        return new Promise((resolve, reject) => {
            fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pin: pin
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
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

    const values = {
        login,
        roleId,
        userId,
        isLoggedIn,
        onAuthOpen
    };

    return (
        <AuthContext.Provider value={values}>
            <AuthModal
                isOpen={isAuthOpen}
                onClose={onAuthClose}
            />
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
