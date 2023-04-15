import { Paper, Typography, Chip } from "@mui/material";

function LogItem(props) {

    const data = props.data

    

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
                <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle2">PI_Colin_Hartigan_printname</Typography>
                        <Chip label="success" color="success" variant="outlined" size="small" />
                    </div>

                    {/* <div style={{ width: "100%", height: "auto", flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <Typography variant="body1"></Typography>
                    </div> */}

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex" }}>
                        <Typography variant="caption">04-15-2023 @ 08:00</Typography>
                    </div>

                </div>
            </Paper >
        </>
    )
}

export default LogItem;