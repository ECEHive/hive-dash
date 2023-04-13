import { Paper, Typography, Chip } from "@mui/material";

function LogItem(props) {
    <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
        <div style={{ width: "100%", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                <Typography variant="subtitle2">01-23-2023</Typography>
                <Chip label="update" color="warning" variant="outlined" size="small" />
            </div>
            <Typography variant="body1">this is a long description of what happened</Typography>

        </div>
    </Paper>
}

export default LogItem;