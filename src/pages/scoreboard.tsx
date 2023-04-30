import React from "react";
import { type NextPage } from "next";
import Layout from "~/components/Layout";
import Image from "next/image";
import { api } from "~/utils/api";
import { getImgIdFromRankId } from "~/utils/fns";
import Link from "~/components/Link/Link";
import { useSession } from "next-auth/react";

const Scoreboard: NextPage = () => {
  const { data } = api.challenges.getLeaderboard.useQuery();

  const { data: sessionData } = useSession();

  return (
    <Layout>
      <h2 className="mb-4 mt-10 text-xl">Who&apos;s leading?</h2>
      <div className="flex w-fit flex-col gap-3 rounded-lg border-2 border-black px-4 py-2 dark:border-gray-400">
        {data &&
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
          })}
      </div>
    </Layout>
  );
};

export default Scoreboard;
