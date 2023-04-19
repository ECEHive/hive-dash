
function getLocalTime() {
    var localTime = new Date()
    var utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000)
    //var edt = new Date(utc + (3600000 * -4))
    // split edt into separate date and time
    var date = localTime.toLocaleDateString("en-CA")
    var time = localTime.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
    console.log(time)

    return [date, time]
}

export { getLocalTime };