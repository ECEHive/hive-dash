import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBkqMj3lJZXY8pnuJcyccT5TFsj7Vu4CKU',
    authDomain: 'hive-af57a.firebaseapp.com',
    projectId: 'hive-af57a',
    storageBucket: 'hive-af57a.appspot.com',
    messagingSenderId: '669856782339',
    appId: '1:669856782339:web:f242a7f082d777c82b9636'
};

// Initialize Firebase
const app = () => {
    const apps = getApps();
    if (apps.length < 1) {
        initializeApp(firebaseConfig);
    }
    return apps[0];
};

const auth = getAuth(app());

export default app;
export const initFirebase = () => {
    return app();
};
export { auth };
