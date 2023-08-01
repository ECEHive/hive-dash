import { createContext, useContext, useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';

import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase';

const AuthContext = createContext(null);

export function useAuthContext() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [user, loading, error] = useAuthState(auth);
    const [currentUser, setCurrentUser] = useState();
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const toast = useToast();
    const { push } = useRouter();

    async function waitForAuthInit() {
        let unsubscribe = null;
        await new Promise((resolve) => {
            unsubscribe = auth.onAuthStateChanged((_) => resolve());
        });
    }

    useEffect(() => {
        setIsAuthLoaded(false);
        async function checkUser() {
            // Wait for auth to initialize before checking if the user is logged in
            await waitForAuthInit().then(async () => {
                setIsAuthLoaded(true);
            });
        }
        checkUser();
    }, [user]);

    useEffect(() => {
        // refreshCurrentUser();
    }, [user]);

    function logOut() {
        signOut(auth);
    }

    const values = {
        user,
        currentUser,
        // refreshCurrentUser,
        auth,
        getAuth,
        logOut,
        signOut,
        signInWithEmailAndPassword,
        isAuthLoaded
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
