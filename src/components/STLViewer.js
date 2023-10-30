import { chakra } from '@chakra-ui/react';

import { StlViewer } from 'react-stl-viewer';

const ChakraSTL = chakra(StlViewer);

export function STLViewer({ ...props }) {
    // i think this is a pretty good color that looks good on both light and dark backgrounds while maintaining shadow visibility for part recognizability
    const modelColor = '#746D69';

    return (
        <ChakraSTL
            {...props}
            modelProps={{
                color: modelColor,
                scale: 1
            }}
            shadows
            orbitControls
        />
    );
}
