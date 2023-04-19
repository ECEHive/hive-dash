// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const body = req.body

    /*
    {
        "printer_name": "",
        "data": {}
    }
    */

    const data = await mongoClient.db("hive-prints").collection("printer-status").updateOne({ name: body.printer_name },
        {
            $push: {
                events: body.data,
            } 
        })

    res.status(200).json({ data });
}
