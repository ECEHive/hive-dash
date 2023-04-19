import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { printer } = req.query;

    const history = await mongoClient.db("hive-prints").collection("printer-status").find({ name: printer }).toArray();

    var events = []

    history.map((entry) => {
        entry.events.map((event) => {
            // console.log(event.date, event.time, event.description)
            // console.log(event.date + "T" + event.time)
            var date = new Date(event.date + "T" + event.time)
            //console.log(date)
            events.push({
                "enabled": event.enabled,
                "dateobj": date,
                "date": event.date + " @ " + event.time,
                "title": event.title,
                "description": event.description,
            })
        })
    })

    //console.log(events)

    // sort events by date
    events.sort((a, b) => {
        return b.dateobj - a.dateobj
    })

    // return first 15 events
    events = events.slice(0, 15)

    res.status(200).json(events);
}
