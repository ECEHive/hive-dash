import { Container } from '@mui/material'

import Home from '../components/home'
import Header from '../components/util/header'

export default function Index() {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>

            <Header/>
            <div style={{ width: "100%", padding: "0px 20px", height: "auto", marginTop: "70px", display: "flex", flexDirection: "column", flexGrow: 1, overflow: "auto" }}>
                <Home />
            </div>

        </div>
    )
} 
