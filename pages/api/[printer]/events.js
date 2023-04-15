import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printer } = req.query;

    const history = await mongoClient.db("hive-prints").collection("print-log").find({ printer_name: printer }).toArray();

    var events = []

    history.map((entry) => {
        entry.events.map((event) => {
            var date = new Date(event.date + "T" + event.time)
            console.log(date)
            events.push({
                "type": event.type,
                "bruh": event.date + " " + event.time,
                "date": date,
                "comment": event.comment,
                "tray_name": entry.tray_name,
            })
        })
    })

    // sort events by date and time

    events.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        }
        if (a.date > b.date) {
            return -1;
        }
        if (a.time < b.time) {
            return 1;
        }
        if (a.time > b.time) {
            return -1;
        }
        return 0;
    })

    res.status(200).json(events);
}
