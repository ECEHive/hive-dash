
import { Container, Typography, TextField, Button, Paper, Stepper, Step, StepLabel, StepContent, Chip } from "@mui/material"
import { Check, Warning, Info, Add } from "@mui/icons-material"


function FindPrint(props) {
    return (
        <Container maxWidth="lg" sx={{ width: "100%", height: "100%", marginBottom: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <Typography variant="h4">Search for a print</Typography>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="First name" placeholder="George" variant="outlined" size="small" onChange={null} />
                    <TextField label="Last name" placeholder="Brudell" variant="outlined" size="small" onChange={null} />
                </div>

                <Typography variant="body1">or</Typography>

                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <TextField label="Print name" placeholder="george_brudell_trayname" variant="outlined" size="small" sx={{ width: "30ch" }} onChange={null} />
                </div>

                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", flexGrow: 1 }}>
                    <Button variant="outlined" >Search</Button>
                </div>
            </div>

            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>

                <Paper variant="outlined" sx={{ width: "100%", height: "auto", }}>
                    <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>

                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                            <Typography variant="h5">PI_Colin_Hartigan_print</Typography>
                            <Chip label="Center Stratasys" variant="outlined" size="small" />
                        </div>


                        <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                            <div style={{ width: "50%", height: "auto", display: "flex", flexDirection: "column", jusfifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                                <div style={{width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
                                    <Typography variant="h6">Queued by</Typography>
                                    <Typography variant="body1">Colin Hartigan</Typography>
                                </div>

                                <div style={{width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
                                    <Typography variant="h6">Estimated time</Typography>
                                    <Typography variant="body1">04:24</Typography>
                                </div>

                                <div style={{width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start"}}>
                                    <Typography variant="h6">Estimated material</Typography>
                                    <Typography variant="body1">20 in^3</Typography>
                                </div>

                            </div>

                            <div style={{ width: "50%", height: "auto" }}>
                                <Stepper activeStep={3} orientation="vertical">
                                    <Step active>
                                        <StepLabel icon={<Check color="success" />} optional={<Typography variant="caption">2023-05-10 @ 10:00</Typography>}>Print success</StepLabel>
                                    </Step>
                                    <Step active>
                                        <StepLabel icon={<Info color="info" />} optional={<Typography variant="caption">2023-05-10 @ 10:00</Typography>}>Print started</StepLabel>
                                    </Step>
                                    <Step active>
                                        <StepLabel icon={<Warning color="error" />} optional={<Typography variant="caption">2023-05-10 @ 10:00</Typography>}>Print failed</StepLabel>
                                        <StepContent>
                                            fell off build plate
                                        </StepContent>
                                    </Step>
                                    <Step active>
                                        <StepLabel icon={<Info color="info" />} optional={<Typography variant="caption">2023-05-10 @ 10:00</Typography>}>Print started</StepLabel>
                                    </Step>
                                    <Step active>
                                        <StepLabel icon={<Add color="primary" />} optional={<Typography variant="caption">2023-05-10 @ 10:00</Typography>}>Print queued</StepLabel>
                                    </Step>
                                </Stepper>
                            </div>
                        </div>
                    </div>
                </Paper>

            </div>

        </Container>
    )
}

export default FindPrint