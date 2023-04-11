import React from "react";
import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";

const USERS = [
  { name: "Brabus", points: 670 },
  { name: "Kar", points: 438 },
  { name: "Picus", points: 346 },
  { name: "Marexo", points: 134 },
  { name: "Marexander", points: 57 },
  { name: "Jozo", points: 40 },
  { name: "Kokot", points: 14 },
];

const calculateRank = (points: number) => {
  if (!points) {
    return 1;
  }
  return Math.ceil(points / 50);
};

const Scoreboard: NextPage = () => {
  return (
    <Layout>
      <div className="w-50 flex flex-col gap-3 rounded-lg border-2 border-black px-4 py-2">
        {USERS.map((user, i) => {
          const getImgId = () => {
            const rank = calculateRank(user.points);
            let str = rank.toString();
            if (str.length === 1) {
              str = "0" + str;
            }
            return str;
          };
          return (
            <>
              <div
                key={i}
                className="flex flex-row items-center justify-between gap-10"
              >
                <div className="flex flex-row items-center gap-4">
                  {i + 1 > 3 ? (
                    <p className="font-bold ">{i + 1}</p>
                  ) : (
                    <p className="font-bold text-pink-700">{i + 1}</p>
                  )}
                  <img
                    width={50}
                    height={50}
                    src={`/img/ranks/${getImgId()}.png`}
                    alt={`rank${getImgId()}-name${user.name}`}
                  />
                </div>
                <p>{user.name}</p>
                <p className="font-bold">{user.points.toString() + "p"}</p>
              </div>
              {i !== USERS.length - 1 && <div className="border-b-2" />}
            </>
          );
        })}
      </div>
    </Layout>
  );
};

export default Scoreboard;
