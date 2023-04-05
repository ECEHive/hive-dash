import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printer, printId } = req.query;

    const printerResult = await mongoClient.db().collection("printer-status").updateOne({ name: printer },
        {
            $set: {
                "states.current_tray_id": "",
                "states.last_tray_id": printId,
                status: "idle",
            } 
        })
    
    const logResult = await mongoClient.db().collection("print-log").updateOne({ _id: new ObjectId(printId) },
        {
            $set: {
                "done": true,
                "failed": false,
            } 
        })

    res.status(200).json({ printerResult: printerResult, logResult: logResult });
}
