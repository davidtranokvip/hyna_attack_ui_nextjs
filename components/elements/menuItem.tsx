import { IoMdSettings, IoMdTime } from "react-icons/io";
import { GiTeamIdea } from "react-icons/gi";
import { FaUsers, FaUserTag } from "react-icons/fa";
import { RiSwordFill } from "react-icons/ri";
import { MdHandyman } from "react-icons/md";
import { HiServer } from "react-icons/hi";

export const menuItems = [
  {
    path: 'attack',
    title: 'Attack Hub',
    icon: <RiSwordFill />
  },
  {
    path: 'attack_manager',
    title: 'Attack Manager',
    icon: <MdHandyman />
  },
  {
    path: 'users',
    title: 'Users',
    icon: <FaUsers />
  },
  {
  path: 'teams',
  title: 'Teams',
  icon: <GiTeamIdea />
  },
  {
    path: 'user_log',
    title: 'User Log',
    icon: <IoMdTime />
  },
  {
    path: 'permissions',
    title: 'Permission',
    icon: <FaUserTag />
  },
  {
    path: 'settings',
    title: 'Setting',
    icon: <IoMdSettings />
  },
  {
    path: 'server',
    title: 'Server',
    icon: <HiServer />
  },
];
