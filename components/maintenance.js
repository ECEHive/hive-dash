import { useState, useEffect } from "react";

import { Add } from "@mui/icons-material";
import { Button, Chip, Container, Switch, Tooltip, Typography, Select, MenuItem, FormControl, InputLabel, Divider } from "@mui/material";

import Printer from "./maintenance/printer.js";
import NewMaintenance from "./maintenance/newMaintenance.js";


function Maintenance(props) {

    /*
        things to track:
            - printer status up/down 
                - note about why it's up/down
            - notes about recent performance
            - notes about recent maintenance
    */

    const [printerName, setPrinterName] = useState("");
    const [printerData, setPrinterData] = useState([]);
    const [printers, setPrinters] = useState([])

    useEffect(() => {
        fetch(`/api/printers`)
            .then(res => res.json())
            .then(data => {
                setPrinters(data)
            })
    }, [])

    function selectPrinter(event) {
        setPrinterName(event.target.value)
        setPrinterData(printers.find(printer => printer.name === event.target.value))
    }


    return (
        <Container maxWidth="lg" sx={{ width: "100%", height: "100%", marginBottom: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>

            <NewMaintenance />
            
            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <Typography variant="h4">Printer maintenance</Typography>
            </div>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    {/* <Typography variant="body1">Select a printer</Typography> */}
                    <FormControl fullWidth sx={{ minWidth: "200px" }}>
                        <InputLabel id="printer-select-label">Printer</InputLabel>
                        <Select labelId="printer-select-label" label="Printer" value={printerName} variant="outlined" size="small" onChange={selectPrinter}>
                            {printers.map((printer, index) => {
                                return (
                                    <MenuItem key={index} value={printer.name}>{printer.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <Divider flexItem orientation="horizontal" variant="middle" />

            {printerName !== "" ?
                <Printer printerName={printerName} printerData={printerData} />
                : <>
                    <Typography variant="bod1">Select a printer</Typography>
                </>
            }

        </Container>
    )
}

export default Maintenance; 