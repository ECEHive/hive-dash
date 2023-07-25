import { createContext, useCallback, useEffect, useState } from 'react';

import PinModal from '@/components/PinModal';

const AuthContext = createContext({});

function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={{}}>
            <PinModal />
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthProvider };
