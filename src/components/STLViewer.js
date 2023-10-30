import { useMemo, useState } from 'react';

import { Box, Spinner, VStack, chakra } from '@chakra-ui/react';

import { StlViewer } from 'react-stl-viewer';

const ChakraSTL = chakra(StlViewer);

export function STLViewer({ url, viewerProps, ...props }) {
    // i think this is a pretty good color that looks good on both light and dark backgrounds while maintaining shadow visibility for part recognizability
    const modelColor = '#746D69';

    const [isLoading, setIsLoading] = useState(false);

    const modelUrl = useMemo(() => {
        if (url) {
            setIsLoading(true);
            return url;
        }
        setIsLoading(false);
        return null;
    }, [url]);

    return (
        <>
            <Box
                {...props}
                position="relative"
            >
                {isLoading && (
                    <VStack
                        w="full"
                        h="full"
                        justify="center"
                        bgColor="blackAlpha.400"
                        position="absolute"
                        zIndex="banner"
                        top={0}
                        borderRadius={5}
                    >
                        <Spinner />
                    </VStack>
                )}
                <ChakraSTL
                    {...viewerProps}
                    modelProps={{
                        color: modelColor,
                        scale: 1
                    }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    shadows
                    url={modelUrl}
                    zIndex="base"
                    position="absolute"
                    top={0}
                    orbitControls
                    onFinishLoading={() => setIsLoading(false)}
                />
            </Box>
        </>
    );
}
