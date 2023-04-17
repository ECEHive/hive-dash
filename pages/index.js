import { useState } from 'react'

import Home from '../components/home'
import Header from '../components/util/header'
import Logs from '../components/printLogs'
import Maintenance from '../components/maintenance'
import FindPrint from '../components/findPrint'

export default function Index() {

    const [page, setPage] = useState(1)

    const pages = [<Home key="home"/>, <Maintenance key="maintenance"/>, <FindPrint key="find"/>, <Logs key="logs"/>]

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>

            <Header page={page} setPage={setPage} />
            <div style={{ width: "100%", padding: "0px 20px", height: "auto", marginTop: "70px", display: "flex", flexDirection: "column", flexGrow: 1, overflowX: "hidden"}}>
                {pages[page]}
            </div>

        </div>
    )
} 
