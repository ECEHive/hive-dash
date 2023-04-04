import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printerName } = req.query;

    const data = await mongoClient.db().collection("print-log").find({ printer_name: printerName, done: false }).toArray();

    res.status(200).json({ printsInQueue: data.length });
}
