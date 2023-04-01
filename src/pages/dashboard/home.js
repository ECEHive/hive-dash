import { Button, Chip, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import Printer from "./components/printer";
import NewPrint from "./components/newPrint"


function Home(props) {

    const printers = {
        "Ultimakers": [
            {
                name: "Ultimaker 1",
                status: "printing",
                states: {
                    tray: "PI_Colin_Hartigan_lizard",
                    queued_by: "Colin Hartigan",
                    queued_date: "03/31/2023"
                },
            },
            {
                name: "Ultimaker 2",
                status: "idle",
                states: {
                    last_tray: "Shri_Thada_funnel",
                }
            },
            {
                name: "Ultimaker 3",
                status: "down",
                states: {
                    last_tray: "Shri_Thada_funnel",
                    down_note: "tray not leveling, head not extruding"
                }
            },
            {
                name: "Ultimaker 4",
                status: "printing",
                states: {
                    tray: "Will_Lauer_dog",
                    queued_by: "Colin Hartigan",
                    queued_date: "03/20/2023"
                },
            },
        ],
        "FormLabs": [
            {
                name: "CloudyPitilia",
                status: "printing",
                states: {
                    tray: "PI_Colin_Hartigan_axolotl longer",
                    queued_by: "Colin Hartigan",
                    queued_date: "03/31/2023"
                },
            },
            {
                name: "i forgor the name",
                status: "idle",
                states: {
                    last_tray: "idk",
                }
            },
        ],
        "Stratasyses": [
            {
                name: "Left",
                status: "printing",
                states: {
                    tray: "PI_Colin_Hartigan_lizard",
                    queued_by: "Colin Hartigan",
                    queued_date: "03/31/2023"
                },
            },
            {
                name: "Center",
                status: "idle",
                states: {
                    last_tray: "Shri_Thada_funnel",
                }
            },
            {
                name: "Right",
                status: "down",
                states: {
                    last_tray: "Shri_Thada_funnel",
                    down_note: "idk what happened this time it keeps breaking"
                }
            },
        ]
    }

    return (
        <>
            <NewPrint/>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", flexGrow: 1, gap: "20px" }}>

                <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>
                    {Object.keys(printers).map((printer) => {
                        var data = printers[printer];
                        return (
                            <div key={printer} style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px", marginBottom: "20px" }}>
                                <div style={{width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px"}}>
                                    <Button variant="outlined" size="small" startIcon={<Add/>}>New print</Button>
                                    <Typography variant="h5">{printer}</Typography>
                                </div>

                                {/* idk why the sizing of this parent div is fucked up but the margin applied to the div above this fixes it well enough */}
                                <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: "15px" }}>
                                    {data.map((printer) => {
                                        return (
                                            <Printer key={printer.name} name={printer.name} status={printer.status} states={printer.states} />
                                        )
                                    })}
                                </div>

                            </div>
                        )
                    })}
                </div>

                <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>

                    the other side
                </div>


            </div>
        </>
    )
}

export default Home;