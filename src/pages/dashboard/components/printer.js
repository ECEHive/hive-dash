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



    const statuses = {
        "idle": "warning",
        "printing": "success",
        "down": "error"
    }

    const actions = {
        "idle": ["Select job", "History"],
        "printing": ["Mark as complete", "Mark as failed"],
        "down": ["History"]
    }

    const icons = {
        "Select job": <Folder />,
        "Mark as complete": <ThumbUp />,
        "Mark as failed": <ThumbDown />,
        "History": <History />,
    }

    return (
        <Paper variant="outlined" sx={{ width: "220px", height: "100%", display: "flex", flexDirection: "column", padding: "10px" }}>

            <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>

                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px", }}>
                        <Typography variant="h6">{name}</Typography>
                        <Chip variant="outlined" size="small" label={status} color={statuses[status]} />
                    </div>
                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Typography variant="subtitle2">3 prints in queue</Typography>
                    </div>
                </div>

                <Divider sx={{ width: "80%", alignSelf: "center", margin: "3px 0px" }} />

                {Object.keys(states).map((state) => {
                    return (
                        <State key={state} header={state} text={states[state]} />
                    )
                })}

                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", flexGrow: 1, gap: "5px" }}>
                    {actions[status].map((action) => {
                        return (
                            <Tooltip key={action} title={action} placement="bottom" arrow>
                                <Button key={action} variant="outlined" size="small" sx={{ width: "100%" }}>{icons[action]}</Button>
                            </Tooltip>
                        )
                    })}
                </div>

            </div>
        </Paper >
    )
}

export default Printer;