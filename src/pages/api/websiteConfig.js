import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'GET') {
        const data = await mongoClient.db('global-config').collection('website').find({ id: 'website' }).toArray();

        console.log(data);
        //.find({ completed: false })

        res.status(200).json({ config: data[0] });
    }
}
