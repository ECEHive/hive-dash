import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';
import { PrintStates } from '@/util/states';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        let uid,
            allowed = await validateRequest(req, PITypes.PI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const printsInQueue = await mongoClient
            .db('printing')
            .collection('print-log')
            .find({
                $or: [{ state: PrintStates.QUEUED }, { state: PrintStates.FAILED }, { state: PrintStates.PRINTING }]
            })
            .sort({ queuedAt: 1 })
            .toArray();

        const printers = await mongoClient.db('printing').collection('printers').find().toArray();

        // for each printer, insert a print's ID to the queue array if it's not already in the array

        // console.log(printsInQueue);

        printers.forEach(async (printer) => {
            let queue = printer.queue;
            const printsInQueueForPrinter = printsInQueue.filter((print) => print.printer === printer.id);
            printsInQueueForPrinter.forEach((print) => {
                if (!queue.includes(print._id)) {
                    queue.push(print._id.toString());
                }
            });

            // remove duplicates from queue
            queue = [...new Set(queue)];

            await mongoClient
                .db('printing')
                .collection('printers')
                .updateOne(
                    {
                        id: printer.id
                    },
                    {
                        $set: {
                            queue: queue
                        }
                    }
                );
        });

        const data = res.status(200).json({});
    }
}
