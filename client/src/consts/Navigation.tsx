import { TbSolarPanel2 } from 'react-icons/tb';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoAdd } from 'react-icons/io5';
import { IoMdSettings } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDropdownCircle } from "react-icons/io";



export const NGO_DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'profile',
        label: 'Profile',
        path: '/ngo/profile',
        icon: <IoPerson />
    },
    {
        key: 'ngodashboard',
        label: 'NGO Dashboard',
        path: '/ngo',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'allcauses',
        label: 'All Causes',
        path: '/ngo/allcauses',
        icon: <IoSearch />
    },
    {
        key: 'mycauses',
        label: 'My Causes',
        path: '/ngo/mycauses',
        icon: <IoIosArrowDropdownCircle />
    },
];

export const CONTRIBUTOR_DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'home',
        label: 'Home',
        path: '/',
        icon: <FaHome />
    },
    {
        key: 'contributordashboard',
        label: 'Contributor Dashboard',
        path: '/contributor/dashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'farms',
        label: 'Farms',
        path: '/farms',
        icon: <TbSolarPanel2 />
    },
    {
        key: 'createfarms',
        label: 'Create Farms',
        path: '/createfarms',
        icon: <IoAdd />
    },
];

export const DASHBOARD_SIDEBAR_LINKS_BOTTOM = [
    {
        key: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: <IoMdSettings />
    },
    {
        key: 'help',
        label: 'Help',
        path: '/help',
        icon: <IoIosHelpCircleOutline />
    },
    {
        key: 'logout',
        label: 'Logout',
        path: '/login',
        icon: <MdLogout />
    },
];

export const NGO_DASHBOARD_SIDEBAR_LINKS_BOTTOM = [
    {
        key: 'ngosettings',
        label: 'Settings',
        path: '/ngo/settings',
        icon: <IoMdSettings />
    },
    {
        key: 'help',
        label: 'Help',
        path: '/help',
        icon: <IoIosHelpCircleOutline />
    },
    {
        key: 'logout',
        label: 'Logout',
        path: '/ngologin',
        icon: <MdLogout />
    },
];