import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'GET') {
        const data = await mongoClient.db('global-config').collection('general').find({ id: 'website' }).toArray();

        //.find({ completed: false })

        res.status(200).json({ config: data[0] });
    } else if (req.method === 'PUT') {
        const body = req.body;

        delete body._id;

        const data = await mongoClient
            .db('global-config')
            .collection('general')
            .updateOne({ id: 'website' }, { $set: { ...body } });

        res.status(200).json({ data });
    }
}
