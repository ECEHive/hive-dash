import Image from 'next/image'

import logo from '../assets/square_logo.png';
import { Button, Tab, Tabs, Typography } from '@mui/material';

function Header(props) {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "99%", height: "40px", background: "#fff", zIndex: 99, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "15px 20px", gap: "15px" }}>
            <Image style={{ width: "auto", height: "100%" }} src={logo} alt="hive logo" />
            <Typography variant="h4" sx={{ width: "auto", height: "auto", lineHeight: null }}><strong>3D PRINTING</strong></Typography>
            <div style={{ width: "auto", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                <Tabs value={0} onChange={null}>
                    <Tab label="Dashboard" />
                    <Tab label="Maintainance" />
                    <Tab label="Logs" />
                </Tabs>
            </div>
        </div>
    )
}

export default Header;