import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

export async function validatePerms(request, minRole) {
    const userId = request.headers.authorization?.split(' ')[1] || '';

    if (userId.length < 10) return false;

    const mongoClient = await clientPromise;

    const user = await mongoClient
        .db('global-config')
        .collection('access')
        .findOne({ _id: new ObjectId(userId) });

    console.log(user);

    if (!user) return false;

    if (user.role >= minRole) {
        return true;
    } else {
        return false;
    }
}
