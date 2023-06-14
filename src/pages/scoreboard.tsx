import React from "react";
import { type NextPage } from "next";
import Layout from "~/components/Layout";
import Image from "next/image";
import { api } from "~/utils/api";
import { getImgIdFromRankId } from "~/utils/fns";
import Link from "~/components/Link/Link";
import { useSession } from "next-auth/react";
import PodiumIcon from "~/components/Icons/PodiumIcon";

const Scoreboard: NextPage = () => {
  const { data } = api.challenges.getLeaderboard.useQuery();

  const { data: sessionData } = useSession();

  return (
    <Layout>
      <h2 className="mb-4 mt-10 text-xl">Who&apos;s leading?</h2>
      <div className="flex w-fit flex-col gap-3 rounded-lg border-2 border-black px-4 py-2 dark:border-gray-400">
        <div className="mb-6 mt-4 flex flex-row justify-center">
          <PodiumIcon />
        </div>
        {data ? (
          data.map((user, i) => {
            const imgId = getImgIdFromRankId(user.rankId || 1);
            const isMe = sessionData && sessionData.user.id === user.id;
            return (
              <>
                <div
                  key={user.id}
                  className="flex flex-row items-center justify-between gap-10"
                >
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-3">
                      {i + 1 > 3 ? (
                        <p>{i + 1}</p>
                      ) : (
                        <p className="font-bold">{i + 1}</p>
                      )}
                    </div>
                    <Image
                      width={50}
                      height={50}
                      src={`/img/ranks/${imgId}.png`}
                      alt={`rank${imgId}-name${user.name || ""}`}
                    />
                  </div>
                  {isMe ? (
                    <b>
                      <Link href="/results">{user.name}</Link>
                    </b>
                  ) : (
                    <Link href={`/results/${user.id}`}>{user.name}</Link>
                  )}
                  <p className="font-bold">{user.points.toString() + "p"}</p>
                </div>
                {i !== data.length - 1 && (
                  <div className="border-b-2 border-gray-200 dark:border-gray-500" />
                )}
              </>
            );
          })
        ) : (
          <div className="h-20 w-60" />
        )}
      </div>
      <div className="mt-20 px-2 md:w-1/3">
        <p className="text-center italic">
          If you&apos;re going to try, go all the way. There is no other feeling
          like that. You will be alone with the gods, and the nights will flame
          with fire. You will ride life straight to perfect laughter. It&apos;s
          the only good fight there is.
        </p>
        <p className="mt-4 text-center text-xl font-bold">Charles Bukowski</p>
      </div>
    </Layout>
  );
};

export default Scoreboard;
