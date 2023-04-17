import Image from 'next/image'

import logo from '../../assets/square_logo.png';
import { Button, Tab, Tabs, Typography } from '@mui/material';

function Header(props) {
    const page = props.page;
    const setPage = props.setPage;

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "60px", marginLeft: "15px", background: "#fff", zIndex: 99, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "15px" }}>
            
            <div style={{width: "auto", height: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px"}}>
                <Image style={{ width: "auto", height: "35px" }} src={logo} alt="hive logo" />
                <Typography variant="h4" sx={{ width: "auto", height: "auto", lineHeight: null }}><strong>3D PRINTING</strong></Typography>
            </div>
            
            <div style={{ width: "auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Tabs value={page} onChange={(e, newValue) => {setPage(newValue)}}>
                    <Tab label="Dashboard" />
                    <Tab label="Maintenance" />
                    <Tab label="Find a print" />
                    <Tab label="Logs" />
                </Tabs>
            </div>
        </div>
    )
}

export default Header; 