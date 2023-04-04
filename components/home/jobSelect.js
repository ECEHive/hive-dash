import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";

function JobItem(props) {

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", jusfiyContent: "flex-start", alignItems: "flex-start" }}>

                <div style={{ width: "auto", height: "100%", margin: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>

                    <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "2px" }}>
                        <Typography variant="body1">PI_Colin_Hartigan_axolotl</Typography>
                        <Typography variant="subtitle2">#1245</Typography>
                        <Chip variant="outlined" size="small" sx={{ marginLeft: "5px" }} label="Ultimaker 3" color="info" />
                    </div>

                    <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "20px" }}>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>
                            <Typography variant="body2">End user</Typography>
                            <Typography variant="subtitle2">Colin Hartigan</Typography>
                        </div>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>
                            <Typography variant="body2">Queued at</Typography>
                            <Typography variant="subtitle2">04/01/2023 12:34</Typography>
                        </div>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>
                            <Typography variant="body2">Queued by</Typography>
                            <Typography variant="subtitle2">Colin Hartigan</Typography>
                        </div>
                    </div>

                </div>

            </Paper>
        </>
    )
}

function SelectJob(props) {
    const printerName = props.printerName

    const [failedJobs, setFailedJobs] = useState([])
    const [nextJobs, setNextJobs] = useState([])

    return (
        <>
            <Dialog open fullWidth maxWidth="sm">
                <DialogTitle>Select a job for {printerName}</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3px" }}>
                            <Typography variant="body1"><strong>Recently failed prints</strong></Typography>
                            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                <JobItem />
                            </div>
                        </div>

                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3px" }}>
                            <Typography variant="body1"><strong>Next in queue</strong></Typography>
                            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                <JobItem />
                            </div>
                        </div>

                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3px" }}>
                            <Typography variant="body1"><strong>Other stuff in queue</strong></Typography>
                            <div style={{ width: "100%", height: "auto", maxHeight: "300px", paddingRight: "10px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                <JobItem />
                                <JobItem />
                                <JobItem />
                                <JobItem />
                                <JobItem />
                                <JobItem />
                                <JobItem />
                                <JobItem />
                                <JobItem />
                            </div>
                        </div>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SelectJob;