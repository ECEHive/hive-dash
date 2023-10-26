import { tokenToID } from '@/pages/api/firebase';

import clientPromise from '@/lib/mongodb';

async function authToken(req) {
    // authorization Header
    const authHeader = req.headers.authorization;

    // bearer Token
    const token = authHeader?.split(' ')[1];

    // verify Token
    const uid = await tokenToID(token);

    return uid;
}

export async function validateRequest(req, minRole) {
    const uid = await authToken(req);
    if (!uid) return null, false;

    const mongoClient = await clientPromise;

    const user = await mongoClient.db('global-config').collection('peer-instructors').findOne({ uid: uid });

    if (!user) return uid, false;

    if (user.type >= minRole) {
        return uid, true;
    } else {
        return uid, false;
    }
}

export { authToken };
