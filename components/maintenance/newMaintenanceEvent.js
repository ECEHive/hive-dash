import { useState, useEffect } from 'react';
import { Button, RadioGroup, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography, Radio } from "@mui/material";
import { getLocalTime } from '../../utils/time';


function NewMaintenance(props) {

    const data = props.data
    const name = props.printerName
    const closeCallback = props.callback

    const [open, setOpen] = useState(true)

    const [enabled, setEnabled] = useState(data.enabled)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    function save() {
        console.log(enabled, title, description)

        var [date, time] = getLocalTime()

        fetch(`/api/${name}/addMaintenanceEvent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "printer_name": name,
                "data": {
                    "enabled": enabled,
                    "title": title,
                    "description": description,
                    "date": date,
                    "time": time
                }
            })
        })
            .then(() => {
                close()
            })
    }

    function close() {
        setOpen(false)
        setTimeout(() => {
            closeCallback()
        }, 500)
    }

    return (
        <Dialog open={open} fullWidth maxWidth="sm">
            <DialogTitle>New maintenance event for {name}</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <div style={{ width: "100%", height: "auto", marginTop: "5px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px" }}>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                        <Typography variant="body1">Event details</Typography>
                        <TextField sx={{ width: "100%" }} required label="Event title" placeholder="Print core replaced" variant="outlined" size="small" onChange={(e) => setTitle(e.target.value)} />
                        <TextField sx={{ width: "100%" }} multiline rows={4} label="Event description" placeholder="Installed a new core on support head" variant="outlined" size="small" onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <Typography variant="body1">Printer status</Typography>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: "3px" }}>
                            <RadioGroup required size="sm" value={enabled} onChange={(e, value) => { setEnabled(value); console.log(value) }}>
                                <FormControlLabel key={1} value={true} label="Printer up" control={<Radio />} />
                                <FormControlLabel key={2} value={false} label="Printer down" control={<Radio />} />
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button disabled={title === ""} onClick={save}>Save</Button>
            </DialogActions>
        </Dialog >
    )
}

export default NewMaintenance;