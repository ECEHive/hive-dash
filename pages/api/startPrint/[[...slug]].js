import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { slug } = req.query;
    const printerName = slug[0];
    const printId = slug[1];

    const result = await mongoClient.db().collection("printer-status").updateOne({ name: printerName },
        {
            $set: {
                "states.current_tray_id": printId,
                status: "printing",
            } 
        })

    res.status(200).json({ result: result });
}
