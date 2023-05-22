import { type NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

import Layout from "~/components/Layout";
import { getImgIdFromRankId } from "~/utils/fns";
import { Loading } from "~/components/Icons/Loading";
import { SignIn } from "~/components/SignIn";
import RankPodium from "~/components/RankPodium";

const UserRanks: React.FC = () => {
  const { data: ranksData } = api.challenges.getAchievedRanks.useQuery();

  if (!ranksData || ranksData?.achievedRanks?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="effect-container z-0 my-10">
        <h1 className="effect my-4 text-center font-league text-5xl">
          my achieved ranks
        </h1>
      </div>
      <div className="absolute bottom-2 right-10 z-0 hidden w-1/3 pt-10 lg:block">
        <RankPodium />
      </div>

      <div
        className="absolute right-10 z-0 mt-20 hidden w-1/3 bg-contain bg-center bg-no-repeat pt-10 md:block"
        style={{ backgroundImage: `url()` }}
      ></div>
      <section className="mt-10 flex w-full flex-col flex-wrap items-center gap-5 pl-0 lg:mt-28 lg:w-2/3 lg:flex-row lg:items-start lg:pl-28">
        {ranksData.achievedRanks.map(({ id, minPoints, name }, index) => {
          const imgId = getImgIdFromRankId(id);
          return (
            <div key={id} className="flex flex-row items-center lg:flex-col">
              <Image
                width={200}
                height={200}
                src={`/img/ranks/${imgId}.png`}
                alt={`rank${imgId}`}
              />

              <div>
                <h2 className="pt-2 text-xl font-bold">{name}</h2>
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
        <div className="flex flex-row items-center lg:flex-col">
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
            <h2 className="pt-2 text-xl font-bold">?</h2>
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
    <Layout isFlexOff>
      {sessionData ? (
        <>
          <UserRanks />
        </>
      ) : (
        <div className="mt-20 flex flex-col items-center">
          <p>You&apos;re missing out!</p>
          <SignIn />
        </div>
      )}
    </Layout>
  );
};

export default Ranks;
