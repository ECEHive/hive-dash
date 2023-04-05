import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printId } = req.query;
    const body = req.body
    delete body._id

    const result = await mongoClient.db("hive-prints").collection("print-log").findOneAndUpdate({ _id: new ObjectId(printId) },
        {
            $set: {
                ...body
            }
        })

    res.status(200).json({ data: result });
}
