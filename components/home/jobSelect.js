import { useState, useEffect } from 'react'
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";
import { Send } from '@mui/icons-material';

function JobItem(props) {

    const data = props.data
    const index = props.index
    const callback = props.callback

    return (
        <>
            <Paper variant="outlined" sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", jusfiyContent: "flex-start", alignItems: "flex-start" }}>

                <div style={{ width: "100%", height: "100%", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>

                    <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "2px" }}>
                        {index !== undefined ?
                            <Typography variant="subtitle2">{index}. </Typography>
                            : null}
                        <Typography variant="body1">{data.tray_name}</Typography>
                        {/* <Typography variant="subtitle2">{data._id}</Typography> */}
                        <Chip variant="outlined" size="small" sx={{ marginLeft: "5px" }} label={data.printer_name} color="info" />
                    </div>

                    <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "20px" }}>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>
                            <Typography variant="body2">End user</Typography>
                            <Typography variant="subtitle2">{data.first_name} {data.last_name}</Typography>
                        </div>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>
                            <Typography variant="body2">Queued at</Typography>
                            <Typography variant="subtitle2">{data.queue_date} {data.queue_time}</Typography>
                        </div>
                        <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "2px" }}>
                            <Typography variant="body2">Queued by</Typography>
                            <Typography variant="subtitle2">{data.PI_name}</Typography>
                        </div>

                        <div style={{ width: "auto", height: "100%", flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", alignSelf: "flex-end", gap: "5px" }}>
                            <Button variant="outlined" size="small" color="primary" onClick={callback} startIcon={<Send/>}>Select</Button>
                        </div>
                    </div>

                </div>

            </Paper>
        </>
    )
}

function SelectJob(props) {
    const printerName = props.printerName

    const [failedJobs, setFailedJobs] = useState(null)
    const [nextJobs, setNextJobs] = useState(null)

    useEffect(() => {
        fetch(`/api/failedPrints/${printerName}`)
            .then(res => res.json())
            .then(data => {
                setFailedJobs(data.failedPrints)
            })

        fetch(`/api/queue/${printerName}`)
            .then(res => res.json())
            .then(data => {
                setNextJobs(data.queue)
            })
    }, [])

    function selectPrint(printId){
        fetch(`/api/startPrint/${printerName}/${printId}`,{
            method: "POST"
        })
    }

    return (
        <>
            {nextJobs !== null && failedJobs !== null ?
                <Dialog open fullWidth maxWidth="sm">
                    <DialogTitle>Select a job for {printerName}</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>

                            {failedJobs !== null && failedJobs.length !== 0 ?
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3px" }}>
                                    <Typography variant="body1"><strong>Recently failed prints</strong></Typography>
                                    <div style={{ width: "100%", height: "auto", maxHeight: "325px", padding: "10px 5px 10px 0px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                        {failedJobs.map((job, index) => {
                                            return <JobItem key={job.tray_name} data={job} callback={() => selectPrint(job._id)}/>
                                        })}
                                    </div>
                                </div>
                                : null}

                            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3px" }}>
                                <Typography variant="body1"><strong>Next in queue</strong></Typography>
                                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", padding: "10px 5px 10px 0px", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                    <JobItem data={nextJobs[0]} index={1} callback={() => selectPrint(nextJobs[0]._id)}/>
                                </div>
                            </div>

                            {nextJobs.length > 1 ?
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "3px" }}>
                                    <Typography variant="body1"><strong>Other stuff in queue</strong></Typography>
                                    <div style={{ width: "100%", height: "auto", maxHeight: "325px", padding: "10px 5px 10px 0px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                        {nextJobs.map((job, index) => {
                                            if (index > 0) {
                                                return <JobItem key={job.tray_name} index={index + 1} data={job} callback={() => selectPrint(job._id)}/>
                                            }
                                        })}
                                    </div>
                                </div>
                                : null}

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button>Cancel</Button>
                    </DialogActions>
                </Dialog>
                : null}
        </>
    )
}

export default SelectJob;