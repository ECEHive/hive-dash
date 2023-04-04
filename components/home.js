import { useEffect, useState } from "react";
import { Button, Chip, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import Printer from "./home/printer";
import NewPrint from "./home/newPrint"
import JobSelect from "./home/jobSelect";

function Home(props) {

    const [printers, setPrinters] = useState({});

    const [newPrintDialog, setNewPrintDialog] = useState(null);
    const [jobSelectDialog, setJobSelectDialog] = useState(null);

    useEffect(() => {
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
                console.log(newPrinters)
                setPrinters(newPrinters)
            })
    }, [])

    function createNewPrint(printerType){
        var dialog = <NewPrint printerType={printerType} printers={printers[printerType]} close={() => {setNewPrintDialog(null)}}/>
        setNewPrintDialog(dialog)
    }

    function createJobSelect(printerName){
        console.log(printerName)
        var dialog = <JobSelect printerName={printerName} close={() => {setNewPrintDialog(null)}}/>
        setJobSelectDialog(dialog)
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
                                <div style={{width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px"}}>
                                    <Typography variant="h5">{printerType}</Typography>
                                    <Button variant="outlined" size="small" startIcon={<Add/>} onClick={() => {createNewPrint(printerType)}}>New print</Button>
                                </div>

                                <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px", flexGrow: 1 }}>
                                    {printers[printerType].map((printer) => {
                                        return (
                                            <Printer key={printer.name} name={printer.name} status={printer.status} states={printer.states} createJob={createJobSelect}/>
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