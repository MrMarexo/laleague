import { type NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

import Layout from "~/components/Layout";
import { ChallengeList } from "~/components/ChallengeList";
import { getImgIdFromRankId } from "~/utils/fns";
import { Loading } from "~/components/Icons/Loading";
import { SignIn } from "~/components/SignIn";
import AttendeesIcon from "~/components/Results/AttendeesIcon";
// import CupIcon from "~/components/Results/CupIcon";
import CheckStarIcon from "~/components/Results/CheckStarIcon";
// import PodiumStarIcon from "~/components/Results/PodiumStarsIcon";
import CheckmarksIcon from "~/components/Results/CheckmarksIcon";
import AgilityIcon from "~/components/Results/AgilityIcon";
import StrenghtIcon from "~/components/Results/StrengthIcon";
import EnduranceIcon from "~/components/Results/EnduranceIcon";

export const UserResults: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: profileData } = api.challenges.getUserResults.useQuery({
    userId,
  });

  const imgId = getImgIdFromRankId(profileData?.rank?.id || 1);

  const stats = [
    {
      icon: <AttendeesIcon />,
      label: "Challenges attended",
      value: profileData?.numberOfAttendedChallenges,
    },
    {
      icon: <CheckStarIcon />,
      label: "Challenges fully completed",
      value: profileData?.numberOfCompletedChallenges,
    },
    {
      icon: <CheckmarksIcon />,
      label: "Tasks completed",
      value: profileData?.numberOfCompletedTasks,
    },
    {
      icon: <AgilityIcon />,
      label: "Agility completed",
      value: 12,
    },
    {
      icon: <StrenghtIcon />,
      label: "Strength completed",
      value: 12,
    },
    {
      icon: <EnduranceIcon />,
      label: "Endurance completed",
      value: 12,
    },
    // {
    //   icon: <PodiumStarIcon />,
    //   label: "Podiums",
    //   value: profileData?.numberOfPodiums,
    // },
    // {
    //   icon: <CupIcon />,
    //   label: "First places",
    //   value: profileData?.numberOfFirst,
    // },
  ];

  return (
    <>
      <section className="my-10 flex flex-col items-center justify-center">
        <div className="effect-container z-0 my-10">
          <h1 className="effect my-4 text-center font-league text-5xl">
            {profileData?.name}
          </h1>
        </div>
        <div className="block flex-row gap-20 md:flex">
          <aside className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center">
              <Image
                width={300}
                height={300}
                src={`/img/ranks/${imgId}.png`}
                alt={`rank${imgId}`}
              />
            </div>
            <p className="effect my-4 text-3xl">{profileData?.rank?.name}</p>
          </aside>

          <ul className="mt-10 space-y-5 text-center md:mt-5 md:text-left">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="mx-auto flex flex-row items-center gap-3 md:text-left"
              >
                <span className="h-12 w-12">{stat.icon}</span>
                {stat.label}: <b>{stat.value}</b>
              </li>
            ))}
            <li className="py-5 text-2xl font-bold">{profileData?.points}p</li>
          </ul>
        </div>
      </section>
    </>
  );
};

const Results: NextPage = () => {
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
          <UserResults userId={sessionData.user.id} />
          <ChallengeList />
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

export default Results;
