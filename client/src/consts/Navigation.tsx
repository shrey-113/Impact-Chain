import { IoMdSettings } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import { BiSolidDonateHeart } from "react-icons/bi";
import { GrValidate } from "react-icons/gr";






export const NGO_DASHBOARD_SIDEBAR_LINKS = [

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
        key: 'allcauses',
        label: 'All Causes',
        path: '/contributor/allcauses',
        icon: <IoSearch />
    },
    {
        key: 'mycauses',
        label: 'My Causes',
        path: '/contributor/mycauses',
        icon: <IoIosArrowDropdownCircle />
    },
    {
        key: 'addcause',
        label: 'Add Cause',
        path: '/contributor/addcause',
        icon: <MdAdd />
    },
    {
        key: 'donate',
        label: 'Donate',
        path: '/contributor/donate',
        icon: <BiSolidDonateHeart />
    },
    {
        key: 'validate',
        label: 'Validate',
        path: '/contributor/validate',
        icon: <GrValidate />
    },
];

export const CONTRIBUTOR_DASHBOARD_SIDEBAR_LINKS_BOTTOM = [
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