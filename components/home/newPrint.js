import { useState, useEffect } from 'react'

import { Check } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Step, Typography, StepLabel, Stepper, TextField, Autocomplete, RadioGroup, Radio, FormControl, FormControlLabel, InputAdornment, Fade, CircularProgress } from "@mui/material";

function UserInfo(props) {

    const callback = props.callback

    const [PIoptions, setPIoptions] = useState([])

    useEffect(() => {
        fetch("/api/peerInstructors")
            .then(res => res.json())
            .then((res) => {
                var options = []
                res.forEach((pi) => {
                    options.push({ label: pi.name, })
                })
                setPIoptions(options)
            })
    }, [])

    return (
        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px" }}>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">End user&apos;s name</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="First name" required variant="outlined" size="small" sx={{ width: "100%" }} onChange={(e) => { callback({ "first_name": e.target.value }) }} />
                    <TextField label="Last name" required variant="outlined" size="small" sx={{ width: "100%" }} onChange={(e) => { callback({ "last_name": e.target.value }) }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">End user&apos;s GT email</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="GT email" required placeholder="gbrudell3@gatech.edu" variant="outlined" size="small" sx={{ width: "100%" }} onChange={(e) => { callback({ "gt_email": e.target.value }) }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">PI name</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <Autocomplete sx={{ width: "100%" }} options={PIoptions} size="small" renderInput={(params) => <TextField required {...params} label="PI name" />} onChange={(e, newval) => { newval !== null ? callback({ "PI_name": newval.label }) : callback({ "PI_name": "" }) }} />
                </div>
            </div>
        </div>
    )
}

function PrintInfo(props) {
    const printers = props.printers
    const materials = props.materials
    const units = props.units
    const callback = props.callback;

    return (
        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px" }}>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">Tray name</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="Tray name" required variant="outlined" size="small" helperText="Format: (M/PI_)Firstname_Lastname_Partdescription" sx={{ width: "100%" }} onChange={(e) => { callback({ "tray_name": e.target.value }) }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">Printer</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <RadioGroup required size="sm" onChange={(e, value) => { callback({ "printer_name": value }) }}>
                        {printers.map((printer) => {
                            return (
                                <FormControlLabel key={printer.name} value={printer.name} label={`${printer.name}${printer.status === 'down' ? ' (down)' : ''}`} control={<Radio />} />
                            )
                        })}
                    </RadioGroup>
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">Material type</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <RadioGroup required size="sm" onChange={(e, value) => { callback({ "material_type": value }) }}>
                        {materials.map((material) => {
                            return (
                                <FormControlLabel key={material} value={material} label={material} control={<Radio />} />
                            )
                        })}
                    </RadioGroup>
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">Estimated material usage</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField variant="outlined" required label={units.type} size="small" sx={{ width: "100%" }} type="number" InputProps={{ endAdornment: <InputAdornment position="end">{units.symbol}</InputAdornment> }} onChange={(e) => { callback({ "est_material": e.target.value }) }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
                <Typography variant="body1">Estimated print time</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="Print time" helperText="Format: HH:MM" required variant="outlined" size="small" sx={{ width: "100%" }} onChange={(e) => { callback({ "est_time": e.target.value }) }} />
                </div>
            </div>
        </div>
    )
}

function Confirmation(props) {
    const saved = props.saved
    const printId = props.printId

    return (
        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px" }}>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                {saved ?
                    <>
                        <Check color="primary" />
                        <Typography variant="body1">Print saved to database</Typography>
                    </>
                    :
                    <>
                        <CircularProgress size={"20px"} />
                        <Typography variant="body1">Saving print to database</Typography>
                    </>
                }
            </div>

            {saved ?
                <Typography variant="body2" sx={{ alignSelf: "center" }}>ID: {printId}</Typography>
                : null}
        </div>
    )
}

function NewPrint(props) {

    const [progress, setProgress] = useState(0)
    const [open, setOpen] = useState(true)

    const [materials, setMaterials] = useState([])
    const [units, setUnits] = useState("g")

    const [responses, setResponses] = useState({})
    const [canContinue, setCanContinue] = useState(false)
    const [saved, setSaved] = useState(false)
    const [printId, setPrintId] = useState("")

    const printerType = props.printerType
    const printers = props.printers
    const closeCallback = props.close

    const continueRequirements = [
        ["first_name", "last_name", "gt_email", "PI_name"],
        ["tray_name", "printer_name", "est_time", "est_material", "est_time"]
    ]

    //TODO: ADD DATE AND TIME OF QUEUE, DONE = FALSE, FAILED = FALSE

    useEffect(() => {
        fetch(`/api/materials/${printerType}`)
            .then((res) => res.json())
            .then((data) => {
                setMaterials(data.materials)
                setUnits(data.units)
            })
    }, [])

    function updateResponses(response) {
        var newResponses = { ...responses, ...response }

        //check if all the keys in continueRequirements are in responses
        var canContinue = true
        var keys = Object.keys(newResponses)
        for (var i = 0; i < continueRequirements[progress].length; i++) {
            var item = continueRequirements[progress][i]
            if (!keys.includes(item)) {
                canContinue = false
                break
            } else {
                if (newResponses[item] === "" || newResponses[item] === undefined) {
                    canContinue = false
                    break
                }
            }
        }

        setResponses(newResponses)
        setCanContinue(canContinue)
    }

    function close() {
        setOpen(false)
        setTimeout(() => {
            closeCallback()
        }, 500)
    }

    function nextCallback() {
        setProgress(progress + 1)
        setCanContinue(false)
        if (progress >= 2) {
            close()
        }
        if (progress === 1) {
            save()
        }
    }

    function save() {
        var localTime = new Date()
        var utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000)
        var edt = new Date(utc + (3600000 * -4))
        // split edt into separate date and time
        var date = edt.toLocaleDateString("en-US").replaceAll("/","-")
        var time = edt.toLocaleTimeString("en-US", { hour12: false })

        var payload = {
            ...responses,
            "queue_date": date,
            "queue_time": time,
            "done": false,
            "failed": false
        }
        fetch("/api/newPrint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((res) => res.json())
            .then((data) => {
                setPrintId(data.printId)
                setSaved(true)
                setProgress(progress + 1)
                setCanContinue(true)
            })
    }

    return (
        <Dialog open={open} fullWidth maxWidth="sm">
            <DialogTitle>Logging print on a {printerType} printer</DialogTitle>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Stepper sx={{ width: "90%", height: "auto", marginBottom: "16px" }} activeStep={progress}>
                    <Step>
                        <StepLabel>End user info</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Print specifics</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirmation</StepLabel>
                    </Step>
                </Stepper>
            </div>
            <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>

                {/* page 1: firstname, lastname, GT email, PI name */}
                {/* page 2: tray name, material type (can narrow this down sicne we already know the printer), print time, material usage */}
                {progress === 0 ? <UserInfo callback={updateResponses} /> : null}
                {progress === 1 ? <PrintInfo callback={updateResponses} printers={printers} materials={materials} units={units} /> : null}
                {progress >= 2 ? <Confirmation saved={saved} printId={printId} /> : null}

            </DialogContent>
            <DialogActions>
                {progress < 2 ? <Button onClick={close}>Cancel</Button> : null}
                <Button disabled={!canContinue} onClick={nextCallback}>{progress >= 2 ? 'Close' : 'Next'}</Button>
            </DialogActions>
        </Dialog >
    )
}

export default NewPrint;