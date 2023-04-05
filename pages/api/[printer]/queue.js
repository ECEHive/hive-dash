import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printer } = req.query;

    const fullQueue = await mongoClient.db().collection("print-log").find({ printer_name: printer, done: false }).sort({queue_date: 1}).toArray();
    const cleanQueue = fullQueue.filter((entry) => {
        return entry.failed === false;
    })

    res.status(200).json({ printsInQueue: fullQueue.length, queue: cleanQueue });
}
