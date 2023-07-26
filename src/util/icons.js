import {
    FaCalendar,
    FaPlay,
    FaPrint,
    FaSitemap,
    FaSortNumericDown,
    FaStop,
    FaTable,
    FaTachometerAlt,
    FaToggleOn,
    FaWrench
} from 'react-icons/fa';
import { FaFaceSmile, FaNoteSticky, FaPencil } from 'react-icons/fa6';

import { AddIcon, CheckIcon, CloseIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons';

const iconSet = {
    wrench: FaWrench,
    play: FaPlay,
    x: CloseIcon,
    check: CheckIcon,
    printer: FaPrint,
    queue: FaSortNumericDown,
    calendar: FaCalendar,
    search: SearchIcon,
    settings: SettingsIcon,
    dashboard: FaTachometerAlt,
    add: AddIcon,
    table: FaTable,
    pencil: FaPencil,
    smile: FaFaceSmile,
    site: FaSitemap,
    toggles: FaToggleOn,
    note: FaNoteSticky,
    stop: FaStop
};

export default iconSet;
