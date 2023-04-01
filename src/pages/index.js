import { Container } from '@mui/material'

import Home from './dashboard/home'
import Header from '../components/header'

export default function Index() {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "auto" }}>

            <Header/>
            <div style={{ width: "95%", height: "auto", marginTop: "70px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Home />
            </div>

        </div>
    )
}
