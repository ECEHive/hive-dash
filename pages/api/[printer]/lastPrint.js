import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printer } = req.query;

    const data = await mongoClient.db("hive-prints").collection("print-log").find({ printer_name: printer, done: true }).sort({queue_date: -1}).sort({queue_time: -1}).toArray();

    res.status(200).json({ lastPrint: data[0] });
}
