import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Step, Typography, StepLabel, Stepper, TextField, Autocomplete } from "@mui/material";


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
            <DialogContent>

                <div style={{ width: "90%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    {/* page 1: firstname, lastname, GT email, PI name */}
                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                            <Typography variant="body1">1. End user&apos;s name</Typography>
                            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                                <TextField label="First name" required variant="outlined" size="small" sx={{ width: "100%" }} />
                                <TextField label="Last name" required variant="outlined" size="small" sx={{ width: "100%" }} />
                            </div>
                        </div>

                        <Typography variant="body1">2. End user&apos;s GT email</Typography>
                        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                            <TextField label="GT email" required placeholder="gbrudell3@gatech.edu" variant="outlined" size="small" sx={{ width: "100%" }} />
                        </div>

                        <Typography variant="body1">3. PI name</Typography>
                        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                            <Autocomplete sx={{width: "100%"}} options={PIoptions} size="small" renderInput={(params) => <TextField required {...params} label="PI name" />}/>
                        </div>
                    </div>
                    {/* page 2: tray name, material type (can narrow this down sicne we already know the printer), print time, material usage */}
                </div>

            </DialogContent>
            <DialogActions>
                <Button>Next</Button>
            </DialogActions>
        </Dialog>
    )
}

export default newPrint;