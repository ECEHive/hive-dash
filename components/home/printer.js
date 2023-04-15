import { useEffect, useState } from 'react'
import { Button, Chip, Divider, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import { ThumbUp, ThumbDown, Folder, History } from '@mui/icons-material'

import Snackbar from '../util/snackbar.js'

function State(props) {
    const header = props.header
    const component = props.component

    return (

        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            { }
            <Typography variant="body1">{header}</Typography>
            {component}
        </div>
    )
}

function Printer(props) {
    const name = props.name //name of the printer
    const status = props.status //is machine up or down
    const states = props.states //details about the status

    const createJob = props.createJob //function to create a job
    const markComplete = props.markComplete
    const markFailed = props.markFailed

    const [printsInQueue, setPrintsInQueue] = useState(0)
    const [printData, setPrintData] = useState({})
    const [lastPrintData, setLastPrintData] = useState({})

    useEffect(() => {
        console.log(states)
        fetch(`/api/${name}/queue`)
            .then(res => res.json())
            .then((res) => {
                setPrintsInQueue(res.printsInQueue)
            })

        if (states.current_tray_id !== "") {
            fetch(`/api/getPrintFromId/${states.current_tray_id}`)
                .then(res => res.json())
                .then((res) => {
                    console.log(res)
                    setPrintData(res.print)
                })
        }

        if (states.last_tray_id !== "") {
            fetch(`/api/getPrintFromId/${states.last_tray_id}`)
                .then(res => res.json())
                .then((res) => {
                    console.log(res)
                    setLastPrintData(res.print)
                })
        }
    }, [props.printers])

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
            "task": () => { markComplete(name, states.current_tray_id) },
        },
        "mark_failed": {
            "text": "Mark as failed",
            "icon": <ThumbDown />,
            "task": () => { markFailed(name, states.current_tray_id) },
        },
        "history": {
            "text": "History",
            "icon": <History />,
            "task": () => { console.log("History") },
        }
    }

    const buttons = {
        "idle": ["select_job"],
        "printing": ["mark_complete", "mark_failed"],
        "down": []
    }

    const fieldDefs = {
        "last_tray": {
            "name": "Last print",
            "component":
                <>
                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle2">{lastPrintData?.tray_name !== undefined ? lastPrintData.tray_name : "N/A"}</Typography>
                        {lastPrintData?.failed ? <Chip size="small" color="error" variant="outlined" label="failed" /> : null}
                    </div>
                </>
        },
        "tray_name": {
            "name": "Tray name",
            "component": <>
                {printData.tray_name !== undefined ?
                    <Typography variant="subtitle2">{printData?.tray_name}</Typography>
                    : <Skeleton variant="rectangular" width={210} height={20} />
                }
            </>
        },
        "queued_date": {
            "name": "Queued on",
            "component": <>
                {printData.queue_date !== undefined ?
                    <Typography variant="subtitle2">{printData?.queue_date} @ {printData?.queue_time}</Typography>
                    : <Skeleton variant="rectangular" width={210} height={20} />
                }
            </>
        },
        "queued_by": {
            "name": "Queued by",
            "component": <>
                {printData.PI_name !== undefined ?
                    <Typography variant="subtitle2">{printData?.PI_name}</Typography>
                    : <Skeleton variant="rectangular" width={210} height={20} />
                }
            </>
        },
        "down_note": {
            "name": "Down note",
            "component": <>
                {states.down_note !== undefined ?
                    <Typography variant="subtitle2">{states.down_note}</Typography>
                    : <Skeleton variant="rectangular" width={210} height={20} />
                }
            </>
        },
        "down_date": {
            "name": "Down since",
            "component": <>
                {states.down_date !== undefined ?
                    <Typography variant="subtitle2">{states.down_date}</Typography>
                    : <Skeleton variant="rectangular" width={210} height={20} />
                }
            </>
        }
    }

    const fields = {
        "idle": ["last_tray"],
        "printing": ["tray_name", "queued_date", "queued_by"],
        "down": ["down_note", "down_date"],
    }

    return (
        <>
            {/* <Snackbar trigger={true} /> */}
            {printData !== null ?
                <Paper variant="outlined" sx={{ minWidth: "255px", height: "100%", display: "flex", flexDirection: "column" }}>

                    <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

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
                            var data = fieldDefs[field]
                            return (
                                <State key={field} header={data.name} component={data.component} />
                            )
                        })}

                        <div style={{ width: "100%", height: "auto", marginTop: "5px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", flexGrow: 1, gap: "10px" }}>
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
                : null
            }
        </>
    )
}

export default Printer;