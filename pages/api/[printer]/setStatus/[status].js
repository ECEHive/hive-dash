import clientPromise from '../../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printer, status } = req.query;

    const result = await mongoClient.db("hive-prints").collection("printer-status").updateOne({ name: printer },
        {
            $set: {
                enabled: status
            } 
        })

    res.status(200).json({ result: result });
}
