import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLibraryAdd } from "react-icons/md";
import { HomeIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { IoMdChatboxes } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { clearToken } from "redux/reducers/authSlice";
import { clearDetails } from "redux/reducers/studentSlice";

const icon = {
  className: "w-5 h-5 text-inherit",
};
const routes = [
  // {
  //   title: "Home",
  //   icon: <HomeIcon {...icon} />,
  //   value: "home",
  //   path: "/instructors/",
  // },
  {
    title: "View courses",
    icon: <Square3Stack3DIcon {...icon} />,
    value: "view-course",
    path: "/instructors/view-course",
  },
  {
    title: "Add courses",
    icon: <MdLibraryAdd {...icon} />,
    value: "add-course",
    path: "/instructors/add-course",
  },
  {
    title: "My students",
    icon: <FaUserGraduate {...icon} />,
    value: "view-students",
    path: "/instructors/view-students",
  },
  {
    title: "My Profile",
    icon: <UserCircleIcon {...icon} />,
    value: "view-profile",
    path: "/instructors/view-profile",
  },
];

const InstructorSideNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const parts = location.pathname.split("/");
  const result = parts.slice(2).join("/");
  const [isActive, setIsActive] = useState<string>(
    result === "" ? "home" : result
  );
  const selected = false;
  const handleClick = (active: string) => {
    setIsActive(active);
  };
  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(clearDetails());
    navigate("/instructors/login");
  };
  return (
    <nav className="bg-[#031839] h-screen w-72 border-r border-gray-300 flex flex-col">
      <div>
        <Typography
          as="a"
          href="#"
          className="px-4 cursor-pointer py-6 font-semibold text-2xl text-white"
        >
          Gamified e learning System
        </Typography>
      </div>
      <ul className="py-6">
        {routes.map(({ title, icon, value, path }, index) => {
          return (
            <Link to={path} key={index}>
              <li className="py-1 px-4">
                <Button
                  variant={isActive === value ? "gradient" : "text"}
                  color={isActive === value ? "blue" : "gray"}
                  className={`flex items-center gap-4 capitalize${
                    isActive && selected ? " bg-indigo-600" : ""
                  }`}
                  fullWidth
                  value={value}
                  onClick={() => {
                    handleClick(value);
                  }}
                >
                  {icon}
                  <Typography
                    color={isActive === value ? "inherit" : "white"}
                    className="font-bold capitalize"
                  >
                    {title}
                  </Typography>
                </Button>
              </li>
            </Link>
          );
        })}
      </ul>
      <div className="px-4 ">
        <Button
          variant={true ? "gradient" : "text"}
          color={true ? "blue" : "gray"}
          className={` gap-4 mt-4 capitalize${true ? " bg-indigo-600" : ""}`}
          fullWidth
        >
          <Link to={"http://localhost:3000"} target="_blank">
            <Typography
              color={true ? "inherit" : "white"}
              className="font-bold capitalize"
            >
              Gaming Engine
            </Typography>
          </Link>
        </Button>
      </div>
      {/* <img src="/img/Group15.png" alt="chat" /> */}
      <div className="absolute bottom-6">
        {/* <img src="/img/Group15.png" alt="chat" /> */}
        <div className="px-4 w-[15rem]">
          <Button
            variant={true ? "gradient" : "text"}
            color={true ? "blue" : "gray"}
            className={` gap-4 capitalize${true ? " bg-indigo-600" : ""}`}
            fullWidth
            onClick={handleLogout}
          >
            <Typography
              color={true ? "inherit" : "white"}
              className="font-bold capitalize"
            >
              Logout
            </Typography>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default InstructorSideNav;
