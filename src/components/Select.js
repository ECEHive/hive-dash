import { chakra } from '@chakra-ui/react';

import { AsyncSelect as normalAsyncSelect, Select as normalSelect } from 'chakra-react-select';

const CSelect = chakra(normalSelect);
const CAsyncSelect = chakra(normalAsyncSelect);

export function Select(props) {
    return (
        <CSelect
            {...props}
            selectedOptionStyle="check"
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
            }}
        />
    );
}

export function AsyncSelect(props) {
    return (
        <CAsyncSelect
            {...props}
            selectedOptionStyle="check"
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
            }}
        />
    );
}
