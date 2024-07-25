import React, { useState } from "react";
import {
  Button,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

import { clearToken } from "redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import LogoutConfirmationModal from "components/elements/student-logout-modal";

const NavItems = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <img src="/img/dashboard.png" className="h-4 w-4" />,
  },
  {
    path: "/dashboard/my-courses",
    name: "My courses",
    icon: <img src="/img/reading.png" className="h-6 w-6" />,
  },
  {
    path: "/dashboard/my-profile",
    name: "My profile",
    icon: <img src="/img/user.png" className="h-6 w-6" />,
  },
  {
    path: "/dashboard/courses",
    name: "Courses",
    icon: <img src="/img/book.png" className="h-6 w-6" />,
  },
  {
    path: "my-progress",
    name: "Progress",
    icon: <img src="/img/progress.png" className="h-6 w-6" />,
  },
  {
    path: "my-leaderboard",
    name: "LeaderBoard",
    // icon: <img src="/img/progress.png" className="h-6 w-6" />,
  },
];

const SideNav: React.FC = () => {
  const [selected, setSelected] = useState<string>("Dashboard");
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    setTimeout(() => {
      dispatch(clearToken());
      navigate("/");
    }, 2000);
  };
  return (
    <Card className="fixed top-0  h-full w-full max-w-[17rem] p-3 rounded-none bg-gradient-to-r from-purple-300 to-purple-500 text-white">
      <div className=" mb-1 p-1 flex items-center gap-4  pl-3"></div>
      <List className="text-white">
        {NavItems.map(({ icon, name, path }, index) => {
          return (
            <Link
              key={index}
              to={path}
              onClick={() => {
                setSelected(name);
              }}
            >
              <ListItem className="mt-2" selected={name === selected}>
                <ListItemPrefix>{icon}</ListItemPrefix>
                <span className="">{name}</span>
              </ListItem>
            </Link>
          );
        })}
      </List>
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
      <div className="absolute bottom-6">
        {/* <img src="/img/Group15.png" alt="chat" /> */}
        <div className="px-4 w-[15rem]">
          <Button
            variant={true ? "gradient" : "text"}
            color={true ? "blue" : "gray"}
            className={` gap-4 capitalize${true ? " bg-indigo-600" : ""}`}
            fullWidth
            onClick={() => setLogoutConfirmationOpen(true)}
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
      <LogoutConfirmationModal
        open={logoutConfirmationOpen}
        setOpen={setLogoutConfirmationOpen}
        onConfirmLogout={handleLogout}
      />
    </Card>
  );
};

export default SideNav;
