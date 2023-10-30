import admin from 'firebase-admin';

import dayjs from '@/lib/time';

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
    universe_domain: 'googleapis.com',
    storageBucket: 'hive-af57a.appspot.com'
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

export async function deleteUser(uid) {
    console.log('deleting');
    const success = await admin
        .auth()
        .deleteUser(uid)
        .then(() => {
            console.log('deleted user');
            return true;
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
            return false;
        });

    return success;
}

export async function uploadFiles(files, name) {
    // upload the stl files to firebase storage and return the urls of each file in an array
    const urls = [];
    const timestamp = dayjs().toISOString();
    for (const file of files[0]) {
        console.log(file.filepath);
        const bucket = admin.storage().bucket('hive-af57a.appspot.com');

        const path = `STLS/${name}_${timestamp}/${file.originalFilename}`;

        const options = {
            destination: path,
            gzip: true
        };

        await bucket.upload(file.filepath, options);

        const storageRef = bucket.file(path);
        storageRef.makePublic();
        const url = storageRef.publicUrl();
        urls.push(url);
    }

    console.log(urls);

    return urls;
}
