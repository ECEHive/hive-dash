import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

export default function SiteBanner() {
    const [alertData, setAlertData] = useState(null);

    useEffect(() => {
        fetch('/api/config/website', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.config.banner);
                setAlertData(data.config.banner);
            });
    }, []);

    return (
        <>
            {alertData?.enabled && (
                <Alert status={alertData.type.value}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>{alertData.title}</AlertTitle>
                        <AlertDescription>
                            <ReactMarkdown
                                components={ChakraUIRenderer()}
                                skipHtml
                            >
                                {alertData.description}
                            </ReactMarkdown>
                        </AlertDescription>
                    </Box>
                </Alert>
            )}
        </>
    );
}
