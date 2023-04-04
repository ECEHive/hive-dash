import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printerType } = req.query;

    const data = await mongoClient.db().collection("printer-materials").find({ printer_type: printerType }).toArray();

    res.status(200).json({ materials: data[0].materials, units: data[0].units });
}
 