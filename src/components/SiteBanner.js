import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import useRequest from '@/hooks/useRequest';

export default function SiteBanner() {
    const [alertData, setAlertData] = useState(null);
    const request = useRequest();

    useEffect(() => {
        request('/api/config/website', {
            method: 'GET'
        })
            .then((data) => {
                console.log(data.config.banner);
                setAlertData(data.config.banner);
            })
            .catch((err) => {});
    }, [request]);

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
