import { Paper, Typography, Chip } from "@mui/material";

function LogItem(props) {

    const data = props.data

    const events = {
        "print_start": {
            "color": "info",
            "label": "print started"
        },
        "print_success": {
            "color": "success",
            "label": "print success"
        },
        "print_fail": {
            "color": "error",
            "label": "print failed"
        }
    }

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
                <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle2">{data.tray_name}</Typography>
                        <Chip label={events[data.type].label} color={events[data.type].color} variant="outlined" size="small" />
                    </div>

                    {data.comment !== "" ?
                        <div style={{ width: "100%", height: "auto", flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <Typography variant="body1">{data.comment}</Typography>
                        </div>
                        : null
                    }

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex" }}>
                        <Typography variant="caption">{data.date}</Typography>
                    </div>

                </div>
            </Paper >
        </>
    )
}

export default LogItem;