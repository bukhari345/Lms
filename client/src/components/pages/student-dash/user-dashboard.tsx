import React from "react";
import DashSideNav from "./dash-side-nav";
import DashHeader from "./dash-header";
import { Outlet } from "react-router-dom";

type Props = {};

const UserDashboard: React.FC = (props: Props) => {
  return (
    <div className="fixed inset-x-0 top-0 flex flex-col font-sans ">
      <DashHeader />

      {/* For small screens, hide the side nav */}
      <div className="block md:hidden">
        <div className="flex flex-col ">
          <div
            className="h-screen overflow-y-auto scrollbar-thin bg-gradient-to-b from-blue-100 to-blue-200"
            // style={{
            //   backgroundImage: "url(/img/Background.jpg)",
            //   backgroundPosition: "bottom",
            //   backgroundSize: "cover",
            // }}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {/* For medium and large screens, show the side nav */}
      <div className="hidden md:flex flex-1 bg-gradient-to-b from-blue-100 to-blue-200">
        <div className="w-64 h-screen overflow-y-auto scrollbar-thin">
          <DashSideNav />
        </div>
        <div className="flex flex-col flex-1">
          <div
            className="p-4  overflow-y-scroll scrollbar-thin  h-screen"
            // style={{
            //   backgroundImage: "url(/img/Background.jpg)",
            //   backgroundPosition: "bottom",
            //   backgroundSize: "cover",
            // }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
