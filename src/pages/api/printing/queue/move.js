import { ObjectId } from 'mongodb';

import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'PUT') {
        let uid,
            allowed = await validateRequest(req, PITypes.MPI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const body = req.body;

        const printObjectIds = body.prints.map((id) => {
            return new ObjectId(id);
        });

        // update each print in body.prints
        // note each id in body.prints needs to be converted to an ObjectId

        const updated = await mongoClient
            .db('printing')
            .collection('print-log')
            .updateMany(
                {
                    _id: {
                        $in: printObjectIds
                    }
                },
                {
                    $set: {
                        printer: body.targetPrinter
                    }
                }
            );

        const removed = await mongoClient
            .db('printing')
            .collection('printers')
            .findOneAndUpdate(
                {
                    id: body.originalPrinter
                },
                {
                    $pull: {
                        queue: {
                            $in: body.prints
                        }
                    }
                }
            );

        const added = await mongoClient
            .db('printing')
            .collection('printers')
            .findOneAndUpdate(
                {
                    id: body.targetPrinter
                },
                {
                    $push: {
                        queue: {
                            $each: body.prints
                        }
                    }
                }
            );

        res.status(200).json({ success: true });
    }
}
