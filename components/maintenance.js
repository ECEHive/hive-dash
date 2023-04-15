import { Add } from "@mui/icons-material";
import { Button, Chip, Container, Paper, Switch, Tooltip, Typography } from "@mui/material";

import MaintenanceItem from "./maintenance/maintenanceItem.js";
import EventItem from "./maintenance/eventItem.js";


function Maintenance(props) {

    /*
        things to track:
            - printer status up/down 
                - note about why it's up/down
            - notes about recent performance
            - notes about recent maintenance
    */

    

    return (
        <Container maxWidth="lg" sx={{ width: "100%", height: "100%", marginBottom: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", flexGrow: 1 }}>
                        <Typography variant="h5">Ultimaker 2</Typography>
                        <Typography variant="body2">Down since 01-23-2023</Typography>
                    </div>
                    <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                        <Chip label="down" color="error" variant="outlined" size="small" />
                        <Switch />
                    </div>
                </div>

                <div style={{ width: "100%", height: "auto", marginTop: "15px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                    <div style={{ width: "50%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>

                        <div style={{ width: "auto", height: "32px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                            <Typography variant="h6"><strong>Maintenance logs</strong></Typography>
                            <Tooltip arrow title="Add a maintenance event" placement="bottom" >
                                <Button variant="outlined" size="small" startIcon={<Add />}>Add</Button>
                            </Tooltip>
                        </div>

                        <div style={{ width: "100%", height: "auto", padding: "5px 0px", maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", marginTop: "5px", gap: "10px" }}>

                            <MaintenanceItem />
                            <MaintenanceItem />
                            <MaintenanceItem />
                            <MaintenanceItem />
                            <MaintenanceItem />

                        </div>
                    </div>

                    <div style={{ width: "50%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>

                        <div style={{ width: "auto", height: "32px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                            <Typography variant="h6"><strong>Recent events</strong></Typography>
                        </div>

                        <div style={{ width: "100%", height: "auto", padding: "5px 0px", maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", marginTop: "5px", gap: "10px" }}>

                            <EventItem />

                        </div>
                    </div>

                </div>
            </div>

        </Container>
    )
}

export default Maintenance; 