import { type NextPage } from "next";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

import Layout from "~/components/Layout";
import { getImgIdFromRankId } from "~/utils/fns";
import { Loading } from "~/components/Icons/Loading";

const UserRanks: React.FC = () => {
  const { data: ranksData } = api.challenges.getAchievedRanks.useQuery();

  if (!ranksData || ranksData?.achievedRanks?.length === 0) {
    return null;
  }

  return (
    <>
      <h1 className="mt-10 text-2xl">My achieved ranks</h1>
      <section className="mt-10 flex flex-col items-center gap-10">
        {ranksData.achievedRanks.map(({ id, minPoints, name }, index) => {
          const imgId = getImgIdFromRankId(id);
          return (
            <div key={id} className="flex flex-row items-center">
              <Image
                width={200}
                height={200}
                src={`/img/ranks/${imgId}.png`}
                alt={`rank${imgId}`}
              />
              <div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p>
                  {id === 1 ? (
                    <>
                      starting <b>&apos;rank&apos;</b>
                    </>
                  ) : (
                    <>
                      <b>{minPoints}p</b> minimum
                    </>
                  )}
                </p>
                {index === ranksData.achievedRanks.length - 1 && (
                  <p className="italic">current</p>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex flex-row items-center">
          <div className="relative">
            <Image
              width={200}
              height={200}
              src="/img/ranks/01.png"
              alt="next-rank"
            />
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-gray-700">
              ?
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">?</h2>
            <p>
              <b>{ranksData.nextRank?.minPoints}p</b> minimum
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

const Ranks: NextPage = () => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <div className="mt-44">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {sessionData ? (
        <>
          <UserRanks />
        </>
      ) : (
        <button
          className=" mt-4 text-base text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
          onClick={() => void signIn()}
        >
          Log in
        </button>
      )}
    </Layout>
  );
};

export default Ranks;
