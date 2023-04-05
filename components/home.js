import { useEffect, useState } from "react";
import { Button, Chip, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import Printer from "./home/printer";
import NewPrint from "./home/newPrint"
import JobSelect from "./home/jobSelect";

function Home(props) {

    const [printers, setPrinters] = useState({});

    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [internalUpdateTrigger, setInternalUpdateTrigger] = useState(0);

    const [newPrintDialog, setNewPrintDialog] = useState(null);
    const [jobSelectDialog, setJobSelectDialog] = useState(null);

    useEffect(() => {
        refreshPrinters();
        const interval = setInterval(() => {
            refreshPrinters();
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    function refreshPrinters() {
        console.log("refresh")
        fetch("/api/printers")
            .then(res => res.json())
            .then((res) => {
                var newPrinters = {}
                res.forEach((printer) => {
                    if (newPrinters[printer.type] == undefined) {
                        newPrinters[printer.type] = []
                    }
                    newPrinters[printer.type].push(printer)
                })
                setPrinters(newPrinters)
            })
    }

    function createNewPrint(printerType) {
        var dialog = <NewPrint printerType={printerType} printers={printers[printerType]} close={() => { setNewPrintDialog(null); refreshPrinters(); }} />
        setNewPrintDialog(dialog)
    }

    function createJobSelect(printerName) {
        console.log(printerName)
        var dialog = <JobSelect printerName={printerName} close={() => { setJobSelectDialog(null); refreshPrinters() }} />
        setJobSelectDialog(dialog)
    }

    function markComplete(printerName, jobId) {
        fetch(`/api/${printerName}/markComplete/${jobId}`)
            .then(res => res.json())
            .then((res) => {
                refreshPrinters()
            })
    }

    function markFailed(printerName, jobId) {
        fetch(`/api/${printerName}/markFailed/${jobId}`)
            .then(res => res.json())
            .then((res) => {
                refreshPrinters()
            })
    }

    return (
        <>
            {newPrintDialog}
            {jobSelectDialog}
            <div style={{ width: "100%", height: "auto", marginBottom: "20px", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>

                <div style={{ width: "50%", height: "100%", padding: "10px 0px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>
                    {Object.keys(printers).map((printerType) => {
                        return (
                            <div key={printerType} style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                                    <Typography variant="h5">{printerType}</Typography>
                                    <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => { createNewPrint(printerType) }}>New print</Button>
                                </div>

                                <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", flexGrow: 1 }}>
                                    {printers[printerType].map((printer) => {
                                        return (
                                            <Printer key={printer.name} printers={printers} name={printer.name} status={printer.status} states={printer.states} createJob={createJobSelect} markComplete={markComplete} markFailed={markFailed}/>
                                        )
                                    })}
                                </div>

                            </div>
                        )
                    })}
                </div>

                <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>


                </div>


            </div>
        </>
    )
}

export default Home;