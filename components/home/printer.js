import { useEffect, useState } from 'react'
import { Button, Chip, Divider, Paper, Tooltip, Typography } from "@mui/material";
import { ThumbUp, ThumbDown, Folder, History } from '@mui/icons-material'

function State(props) {
    const header = props.header
    const text = props.text

    return (

        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <Typography variant="body1">{header}</Typography>
            <Typography variant="subtitle2">{text}</Typography>
        </div>
    )
}

function Printer(props) {
    const name = props.name //name of the printer
    const status = props.status //is machine up or down
    const states = props.states //details about the status
    const createJob = props.createJob //function to create a job

    const [printsInQueue, setPrintsInQueue] = useState(0)
    const [printData, setPrintData] = useState({})

    useEffect(() => {
        console.log(states)
        fetch(`/api/printsInQueue/${name}`)
            .then(res => res.json())
            .then((res) => {
                setPrintsInQueue(res.printsInQueue)
            })

        if (states.current_tray_id !== "") {
            fetch(`/api/print/${states.current_tray_id}`)
                .then(res => res.json())
                .then((res) => {
                    console.log(res)
                    setPrintData(res.print)
                })
        }
    }, [])

    const statuses = {
        "idle": "warning",
        "printing": "success",
        "down": "error"
    }

    const actions = {
        "select_job": {
            "text": "Select job",
            "icon": <Folder />,
            "task": () => { createJob(name) },
        },
        "mark_complete": {
            "text": "Mark as complete",
            "icon": <ThumbUp />,
            "task": () => { console.log("Mark as complete") },
        },
        "mark_failed": {
            "text": "Mark as failed",
            "icon": <ThumbDown />,
            "task": () => { console.log("Mark as failed") },
        },
        "history": {
            "text": "History",
            "icon": <History />,
            "task": () => { console.log("History") },
        }
    }

    const buttons = {
        "idle": ["select_job", "history"],
        "printing": ["mark_complete", "mark_failed"],
        "down": ["history"]
    }

    const fieldDefs = {
        "last_tray": states.last_tray_id,
        "tray_name": printData?.tray_name,
        "queued_date": `${printData?.queue_date} ${printData?.queue_time}`,
        "queued_by": printData?.PI_name,
        "down_note": states.down_note,
        "down_date": states.down_date,
    }

    const fields = {
        "idle": ["last_tray"],
        "printing": ["tray_name", "queued_date", "queued_by"],
        "down": ["down_note", "down_date"],
    }

    return (
        <>
            {printData !== null ?
                <Paper variant="outlined" sx={{ width: "245px", height: "100%", display: "flex", flexDirection: "column", padding: "10px" }}>

                    <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px", }}>
                                <Typography variant="h6">{name}</Typography>
                                <Chip variant="outlined" size="small" label={status} color={statuses[status]} />
                            </div>
                            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Typography variant="subtitle2">{printsInQueue} prints in queue</Typography>
                            </div>
                        </div>

                        {/* <Divider sx={{ width: "80%", alignSelf: "center", margin: "3px 0px" }} /> */}

                        {fields[status].map((field) => {
                            return (
                                <State key={field} header={field} text={fieldDefs[field]} />
                            )
                        })}

                        <div style={{ width: "100%", height: "auto", marginTop: "5px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", flexGrow: 1, gap: "5px" }}>
                            {buttons[status].map((button) => {
                                var action = actions[button]
                                return (
                                    <Tooltip key={action.text} title={action.text} placement="bottom" arrow>
                                        <Button variant="outlined" size="small" sx={{ width: "100%" }} onClick={action.task}>{action.icon}</Button>
                                    </Tooltip>
                                )
                            })}
                        </div>

                    </div>
                </Paper >
                : null}
        </>
    )
}

export default Printer;