import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const body = req.body;

    if (req.method === 'POST') {
        const trayName = body.trayName;
        const printerJobId = body.id;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .findOneAndUpdate(
                {
                    trayName: {
                        $regex: new RegExp(trayName, 'i')
                    }
                },
                {
                    $set: {
                        printerJobId: printerJobId
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
