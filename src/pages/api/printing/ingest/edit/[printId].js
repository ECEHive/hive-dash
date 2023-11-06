import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printId } = req.query;

    const body = req.body;

    const linkedPrintId = printId;

    // try converting the id to an object id to see if the id is a mognodb id or a printer job id
    let objectId;
    let useLinkedId = false;
    try {
        objectId = new ObjectId(linkedPrintId);
    } catch (e) {
        objectId = null;
        useLinkedId = true;
    }

    const print = await mongoClient
        .db('printing')
        .collection('print-log')
        .findOne({
            $or: [{ linkedPrintId: linkedPrintId }, { _id: objectId || '' }]
        });

    // if the print isnt found tell andrew to link it
    if (!print) {
        res.status(400).json({
            success: false,
            type: 'nolink',
            message: 'Print not linked'
        });
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({
            success: true,
            print: print
        });
        return;
    } else if (req.method === 'PUT') {
        const data = body.data;

        delete data._id;

        const updated = await mongoClient
            .db('printing')
            .collection('print-log')
            .findOneAndUpdate(
                {
                    $or: [{ linkedPrintId: linkedPrintId }, { _id: objectId || '' }]
                },
                {
                    $set: {
                        ...data
                    }
                }
            );

        res.status(200).json({
            success: true,
            print: updated.value
        });
    }
}
