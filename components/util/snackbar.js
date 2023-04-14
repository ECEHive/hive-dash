import { useEffect, useState } from "react";

import { Alert, Snackbar, Button } from "@mui/material";

function SnackbarFeedback(props) {

    const trigger = props.trigger;
    const setTrigger = props.setTrigger;
    const text = props.text;
    const type = props.type

    const [open, setOpen] = useState(false);

    function close(event, reason) {
        if (reason !== 'clickaway') {
            setOpen(false);
        }
    }

    useEffect(() => {
        if (trigger) {
            setOpen(true);
            //setTrigger(false);
        }
    }, [trigger])

    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={close} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <Alert severity={"info"} sx={{ width: '100%' }} action={<Button size="small">
                Report
            </Button>}>
                Would you like to log the the printer's performance?
            </Alert>
        </Snackbar>
    )
}

export default SnackbarFeedback;