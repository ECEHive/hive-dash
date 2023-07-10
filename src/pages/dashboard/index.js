import { Text, useColorMode } from "@chakra-ui/react"

import Layout from "@/layouts/PrimaryLayout"

export default function Dashboard(props) {

    const {colorMode, toggleColorMode} = useColorMode()

    return (
        <>
            <Text fontSize="xl">{colorMode}</Text>
        </>
    )
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>