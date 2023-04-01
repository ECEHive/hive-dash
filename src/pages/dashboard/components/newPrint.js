import { Check } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Step, Typography, StepLabel, Stepper, TextField, Autocomplete, RadioGroup, Radio, FormControl, FormControlLabel, InputAdornment } from "@mui/material";

function userInfo(props) {
    return (
        <>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                <Typography variant="body1">End user&apos;s name</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="First name" required variant="outlined" size="small" sx={{ width: "100%" }} />
                    <TextField label="Last name" required variant="outlined" size="small" sx={{ width: "100%" }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                <Typography variant="body1">End user&apos;s GT email</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="GT email" required placeholder="gbrudell3@gatech.edu" variant="outlined" size="small" sx={{ width: "100%" }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                <Typography variant="body1">PI name</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <Autocomplete sx={{ width: "100%" }} options={PIoptions} size="small" renderInput={(params) => <TextField required {...params} label="PI name" />} />
                </div>
            </div>
        </>
    )
}

function printInfo(props) {
    return (
        <>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                <Typography variant="body1">Tray name</Typography>
                <Typography variant="subtitle2">format: (M/PI_)Firstname_Lastname_Partdescription</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="Tray name" required variant="outlined" size="small" sx={{ width: "100%" }} />
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                <Typography variant="body1">Material type</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <RadioGroup size="sm">
                        <FormControlLabel value="pla" label="PLA" control={<Radio />} />
                    </RadioGroup>
                </div>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                <Typography variant="body1">Material usage</Typography>
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField variant="outlined" required label="Volume" size="small" sx={{ width: "100%" }} type="number" InputProps={{ endAdornment: <InputAdornment position="end">in^3</InputAdornment> }} />
                </div>
            </div>
        </>
    )
}

function newPrint(props) {

    const PIoptions = [
        { label: "Colin Hartigan" },
    ]

    return (
        <Dialog open={true} fullWidth maxWidth="sm">
            <DialogTitle>Queue print on [printername]</DialogTitle>
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Stepper sx={{ width: "90%", height: "auto", }}>
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
            <DialogContent sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>

                {/* page 1: firstname, lastname, GT email, PI name */}
                {/* page 2: tray name, material type (can narrow this down sicne we already know the printer), print time, material usage */}
                {/* <FormControl sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                </FormControl> */}
                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <Check />
                    <Typography variant="body1">Print saved to database</Typography>
                </div>
                <Typography variant="body2" sx={{alignSelf: "center"}}>ID: [unique id here]</Typography>
            </DialogContent>
            <DialogActions>
                <Button>Next</Button>
            </DialogActions>
        </Dialog >
    )
}

export default newPrint;