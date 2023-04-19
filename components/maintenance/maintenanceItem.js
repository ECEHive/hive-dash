import { Paper, Typography, Chip } from "@mui/material";

function MaintenanceItem(props) {

    const data = props.data
    /*
    "enabled": event.type,
                "dateobj": date,
                "date": event.date + " @ " + event.time,
                "title": event.title,
                "description": entry.description,
                */

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
                <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle2">{data.title}</Typography>
                        <Chip label={data.enabled ? "marked up" : "marked down"} color={data.enabled ? "success" : "error"} variant="outlined" size="small" />
                    </div>

                    {data.description !== null ?
                        <div style={{ width: "100%", height: "auto", flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <Typography variant="body1">{data.description}</Typography>
                        </div>
                        : null}

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex" }}>
                        <Typography variant="caption">{data.date}</Typography>
                    </div>

                </div>
            </Paper >
        </>
    )
}

export default MaintenanceItem;