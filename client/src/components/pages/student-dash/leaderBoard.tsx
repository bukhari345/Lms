import React from "react";

const LeaderBoard = () => {
  let playerData = { score: 0 };
  let user = {
    result: {
      firstName: "dwe",
    },
  };

  const members = [
    {
      rank: 6,
      name: "Irem",
      score: 953,
      avatar:
        "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png",
      change: "up",
    },
    {
      rank: 7,
      name: "Sara",
      score: 943,
      avatar:
        "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png",
      change: "up",
    },
    {
      rank: 8,
      name: "Fatima",
      score: 914,
      avatar:
        "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png",
      change: "down",
    },
    {
      rank: 9,
      name: "Shiza",
      score: 896,
      avatar:
        "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png",
      change: "down",
    },
    {
      rank: 10,
      name: "Kashif",
      score: 848,
      avatar:
        "https://cdn.pixabay.com/photo/2013/07/12/14/36/man-148582_960_720.png",
      change: "down",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-bottom"
      style={{ backgroundImage: "url('../../../assets/Background.jpg')" }}
    >
      <div className="w-3/5 bg-blue-300 rounded-lg p-6 text-center text-black">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">LEADERBOARD</h1>
        </div>
        <div className="flex justify-around">
          <div className="w-2/5 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold">Top Student</h2>
            <div className="flex justify-around mt-5">
              <div className="flex flex-col items-center gap-2 relative">
                <img
                  src="https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_960_720.png"
                  alt="Yashma"
                  className="border-2 border-gray-300 rounded-full w-16 h-16"
                />
                <p>Yashma</p>
                <p>Level 2</p>
              </div>
              <div className="flex flex-col items-center gap-2 relative">
                <span className="absolute text-2xl transform -translate-y-1/2">
                  👑
                </span>
                <img
                  src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                  alt="Irfan Ali"
                  className="border-2 border-gray-300 rounded-full w-16 h-16"
                />
                <p>{user.result.firstName}</p>
                <p>20{playerData?.score}</p>
              </div>
              <div className="flex flex-col items-center gap-2 relative">
                <img
                  src="https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_960_720.png"
                  alt="Ahmer"
                  className="border-2 border-gray-300 rounded-full w-16 h-16"
                />
                <p>Ahmer</p>
                <p>Level 3</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between p-3 bg-yellow-300 rounded-md mb-4">
                <span>1</span>
                <p>{user?.result?.firstName}</p>
                <p>20{playerData?.score}</p>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-md mb-4">
                <span>2</span>
                <p>Yashma</p>
                <p>1932</p>
              </div>
              <div className="flex justify-between p-3 bg-green-300 rounded-md">
                <span>3</span>
                <p>Ahmer</p>
                <p>1431</p>
              </div>
            </div>
          </div>
          <div className="w-2/5 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-white">Other Members</h2>
            <ul className="mt-5">
              {members.map((member, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-opacity-10 bg-white rounded-md mb-4"
                >
                  <span
                    className={`font-bold ${
                      member.change === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {member.rank}
                  </span>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="rounded-full w-10 h-10 mx-4"
                  />
                  <span className="flex-1 text-left text-white">
                    {member.name}
                  </span>
                  <span className="font-bold text-white">{member.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
