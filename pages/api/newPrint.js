// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const body = req.body

    const data = await mongoClient.db("hive-prints").collection("print-log").insertOne({
        ...body
    })

    res.status(200).json({ printId: data.insertedId});
}
