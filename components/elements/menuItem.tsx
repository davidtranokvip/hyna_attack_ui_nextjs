import { IoLogoBuffer, IoMdSettings } from "react-icons/io";
import { GiTeamIdea } from "react-icons/gi";
import { FaUsers, FaUserTag } from "react-icons/fa";
import { RiSwordFill } from "react-icons/ri";
import { MdHandyman } from "react-icons/md";
import { HiServer } from "react-icons/hi";

export const menuItems = [
  {
    path: 'users',
    title: 'Users',
    icon: <FaUsers />
  },
    {
    path: 'attack_log',
    title: 'ATTACK LOG',
    icon: <IoLogoBuffer />
  },
  {
    path: 'permissions',
    title: 'PERMISSIONS',
    icon: <FaUserTag />
  },
  {
    path: 'teams',
    title: 'TEAMS',
    icon: <GiTeamIdea />
  },
  {
    path: 'attack',
    title: 'ATTACK SITE',
    icon: <RiSwordFill />
  },
  {
    path: 'attack_manager',
    title: 'ATTACK MANAGER',
    icon: <MdHandyman />
  },
  {
    path: 'settings',
    title: 'SETTING MANAGER',
    icon: <IoMdSettings />
  },
  {
    path: 'server',
    title: 'SERVER MANAGER',
    icon: <HiServer />
  },
];
