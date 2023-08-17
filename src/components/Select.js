import { chakra } from '@chakra-ui/react';

import { Select } from 'chakra-react-select';

const ChakraSelect = chakra(Select);

export default function SelectComponent(props) {
    return (
        <ChakraSelect
            {...props}
            selectedOptionStyle="check"
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
            }}
        />
    );
}
