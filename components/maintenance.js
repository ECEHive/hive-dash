import { List, ListItem, ListItemText } from "@mui/material";


function Maintenance(props){

    return (
        <div style={{ width: "100%", height: "100%", marginBottom: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>
            <List sx={{width: "100%", height: "auto", }}>
                <ListItem>
                    <ListItemText primary="Ultimaker 2" secondary="Down since 2021-08-12 12:00:00" />
                </ListItem>
            </List>
        </div>
    )
}

export default Maintenance;