import { Paper, Typography, Chip } from "@mui/material";

function MaintenanceItem(props) {

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
                <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle2">Print core replaced</Typography>
                        <Chip label="marked up" color="success" variant="outlined" size="small" />
                    </div>

                    <div style={{ width: "100%", height: "auto", flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <Typography variant="body1">replaced print core for head 1</Typography>
                    </div>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex" }}>
                        <Typography variant="caption">2023-02-20 @ 18:00</Typography>
                    </div>

                </div>
            </Paper >
        </>
    )
}

export default MaintenanceItem;