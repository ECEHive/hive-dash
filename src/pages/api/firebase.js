import admin from 'firebase-admin';

const serviceAccount = {
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_auth_provider_x509_cert_url,
    auth_uri: process.env.FIREBASE_ADMIN_auth_uri,
    client_email: process.env.FIREBASE_ADMIN_client_email,
    client_id: process.env.FIREBASE_ADMIN_client_id,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_client_x509_cert_url,
    private_key: process.env.FIREBASE_ADMIN_private_key?.replace(/\\n/g, '\n'),
    private_key_id: process.env.FIREBASE_ADMIN_private_key_id,
    project_id: process.env.FIREBASE_ADMIN_project_id,
    token_uri: process.env.FIREBASE_ADMIN_token_uri,
    type: 'service_account',
    universe_domain: 'googleapis.com'
};

const app = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    return admin.app();
};

app();

export async function tokenToID(token) {
    if (!token) {
        return null;
    }
    try {
        const user = await admin.auth().verifyIdToken(token);
        return user.uid;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createUser(email, password) {
    const user = await admin
        .auth()
        .createUser({
            email: email,
            password: password
        })
        .then((userRecord) => {
            console.log('created user');
            // See the UserRecord reference doc for the contents of userRecord.
            return userRecord;
        })
        .catch((error) => {
            console.log('Error creating new user:', error);
            return null;
        });

    return user;
}
