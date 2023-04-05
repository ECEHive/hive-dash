import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material';

function Logs(props) {

    const [logs, setLogs] = useState([])

    const columnDefs = [
        {
            field: "_id",
            headerName: "ID",
            width: 70
        },
        {
            field: "first_name",
            headerName: "First name",
            type: "string",
            width: 100
        },
        {
            field: "last_name",
            headerName: "Last name",
            type: "string",
            width: 100
        },
        {
            field: "gt_email",
            headerName: "GT email",
            type: "string",
            width: 220
        },
        {
            field: "PI_name",
            headerName: "PI name",
            type: "string",
            width: 150
        },
        {
            field: "tray_name",
            headerName: "Tray name",
            type: "string",
            editable: true,
            width: 220
        },
        {
            field: "printer_name",
            headerName: "Printer name",
            type: "string",
            editable: true,
            width: 150
        },
        {
            field: "material_type"
            , headerName: "Material type",
            type: "string",
            editable: true,
            width: 100
        },
        {
            field: "est_material",
            headerName: "Est. material",
            type: "string",
            editable: true,
            width: 100
        },
        {
            field: "est_time",
            headerName: "Est. time",
            type: "string",
            editable: true,
            width: 100
        },
        {
            field: "queue_date",
            headerName: "Queue date",
            type: "date",
            valueGetter: (params) => {
                return new Date(params.row.queue_date)
            },
            width: 100
        },
        {
            field: "queue_time",
            headerName: "Queue time",
            type: "string",
            width: 100
        },
        {
            field: "done",
            headerName: "Done",
            type: "boolean",
            editable: true,
            width: 70
        },
        {
            field: "failed",
            headerName: "Failed",
            type: "boolean",
            editable: true,
            width: 70
        },
        // {
        //     field: "actions",
        //     headerName: "Actions",
        //     width: 130,
        //     renderCell: (cellValues) => {
        //         return (
        //             <>
        //                 <IconButton onClick={() => { console.log(cellValues.row._id) }}>
        //                     <Settings/>
        //                 </IconButton>
        //             </>
        //         )
        //     }
        // }
    ]

    useEffect(() => {
        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    function refresh() {
        fetch("/api/printLogs")
            .then(res => res.json())
            .then((res) => {
                if (res !== logs) {
                    setLogs(res)
                }
            })
    }

    function processRowEdit(newRow) {
        fetch(`/api/updatePrintLog/${newRow._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newRow)
        })
            .then(res => res.json())
            .then((res) => {

            })
        return newRow;
    }

    return (
        <>
            <div style={{ width: "100%", height: "100%", marginBottom: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>
                <DataGrid sx={{ width: "100%", height: "100%" }} loading={logs.length === 0} slots={{ toolbar: GridToolbar }} columns={columnDefs} rows={logs} processRowUpdate={processRowEdit} getRowId={(row) => row._id} />
            </div>
        </>
    )
}

export default Logs;