import clientPromise from '@/lib/mongodb';

import { PrintStates } from '@/util/states';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const body = req.body;

    if (req.method === 'PUT') {
        const printerJobId = body.id;
        const action = body.action;

        const print = await mongoClient
            .db('printing')
            .collection('print-log')
            .findOneAndUpdate(
                {
                    printerJobId: printerJobId
                },
                {
                    $set: {
                        printerJobId: printerJobId
                    }
                }
            );

        // if the print isnt found tell andrew to link it
        if (!print.value) {
            res.status(400).json({
                success: false,
                type: 'nolink',
                message: 'Print not linked'
            });
            return;
        }

        // 1 = start print
        if (action === 1) {
            // check if a print is running on the printer
            const runningPrint = await mongoClient.db('printing').collection('print-log').findOne({
                printer: print.value.printer,
                state: PrintStates.PRINTING
            });

            if (runningPrint) {
                res.status(400).json({
                    success: false,
                    type: 'printerbusy',
                    message: 'Printer still running a print'
                });
                return;
            }

            // update the print state to printing
            const data = await mongoClient
                .db('printing')
                .collection('print-log')
                .findOneAndUpdate(
                    {
                        printerJobId: printerJobId
                    },
                    {
                        $set: {
                            state: PrintStates.PRINTING
                        }
                    }
                );

            // update printer
            const printer = await mongoClient
                .db('printing')
                .collection('printers')
                .findOneAndUpdate(
                    {
                        name: print.value.printer
                    },
                    {
                        $set: {
                            currentTray: print.value._id.toString()
                        }
                    }
                );

            let output = {
                success: true
            };

            res.status(200).json(output);
        }
    }
}
