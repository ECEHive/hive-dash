import clientPromise from '@/lib/mongodb';

import { PrintStates } from '@/util/states';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const body = req.body;

    if (req.method === 'POST') {
        const trayName = body.trayName;
        const linkedPrintId = body.id;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .findOneAndUpdate(
                {
                    trayName: trayName,
                    // $or: [
                    //     // if prints have matching names, this allows us to find the one that hasn't been linked
                    //     {
                    //         linkedPrintId: ''
                    //     },
                    //     {
                    //         linkedPrintId: {
                    //             $exists: false
                    //         }
                    //     },
                    //     {
                    //         linkedPrintId: null
                    //     }
                    // ],
                    $or: [{ state: PrintStates.FAILED }, { state: PrintStates.QUEUED }, { state: PrintStates.PRINTING }]
                },
                {
                    $set: {
                        linkedPrintId: linkedPrintId
                    }
                }
            );

        console.log(data);

        let output = {
            success: false,
            printId: null
        };

        if (data.value) {
            output.success = true;
            output.printId = data.value._id.toString();
        }

        res.status(200).json(output);
    }
}
