import { Paper, Typography, Chip } from "@mui/material";

function LogItem(props) {

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
                <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle2">01-23-2023</Typography>
                        <Chip label="failed print" color="warning" variant="outlined" size="small" />
                    </div>

                    <div style={{ width: "100%", height: "auto", flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <Typography variant="body1">print failed. </Typography>
                    </div>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex" }}>
                        <Typography variant="caption">PI_Colin_Hartigan_printname</Typography>
                    </div>

                </div>
            </Paper >
        </>
    )
}

export default LogItem;