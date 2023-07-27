import {
    AddIcon,
    CheckIcon,
    CloseIcon,
    DeleteIcon,
    ExternalLinkIcon,
    MoonIcon,
    RepeatIcon,
    SearchIcon,
    SettingsIcon,
    SunIcon,
    TimeIcon
} from '@chakra-ui/icons';

import {
    FaCalendar,
    FaCodeBranch,
    FaCubes,
    FaPlay,
    FaPrint,
    FaSave,
    FaSitemap,
    FaSortNumericDown,
    FaStop,
    FaTable,
    FaTachometerAlt,
    FaToggleOn,
    FaUser,
    FaUserCog,
    FaWrench
} from 'react-icons/fa';
import { FaFaceSmile, FaNoteSticky, FaPencil } from 'react-icons/fa6';

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
    stop: FaStop,
    moon: MoonIcon,
    sun: SunIcon,
    external: ExternalLinkIcon,
    delete: DeleteIcon,
    save: FaSave,
    person: FaUser,
    peerInstructor: FaUserCog,
    clock: TimeIcon,
    material: FaCubes,
    refresh: RepeatIcon,
    branch: FaCodeBranch
};

export default iconSet;
