import { CheckBox } from "@mui/icons-material";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography } from "@mui/material";


function NewMaintenance(props) {
    return (
        <Dialog open fullWidth maxWidth="sm">
            <DialogTitle>New maintenance event for Ultimaker 2</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <div style={{ width: "100%", height: "auto", marginTop: "5px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px" }}>

                    <TextField sx={{ width: "100%" }} required label="Event title" placeholder="Print core replaced" variant="outlined" size="small" />
                    <TextField sx={{ width: "100%" }} multiline rows={4} label="Event description" placeholder="Installed a new core on support head" variant="outlined" size="small" />

                    <FormControlLabel
                        label="Mark as down"
                        control={<Checkbox checked={false} onChange={null} />}
                    />

                </div>
            </DialogContent>

            <DialogActions>
                <Button>Cancel</Button>
                <Button>Save</Button>
            </DialogActions>
        </Dialog >
    )
}

export default NewMaintenance;