import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const body = req.body;

        const pin = body.pin;

        const data = await mongoClient.db('global-config').collection('access').findOne({
            pin: pin
        });

        console.log(data);

        res.status(200).json({
            role: data.role,
            id: data._id
        });
    }
}
