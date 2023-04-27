import { NextPage } from "next";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import Layout from "~/components/Layout";
import { ChallengeList } from "~/components/ChallengeList";
import { api } from "~/utils/api";

const UserResults: React.FC = () => {
  const { data: profileData } = api.challenges.getUserResults.useQuery({
    userId: session.user.id,
  });

  const stats = [
    {
      imgSrc: "/img/ranks/10.png",
      label: "Challenges attended",
      value: profileData.user.numberOfAttendedChallenges,
    },
    {
      imgSrc: "/img/ranks/22.png",
      label: "Challenges completed",
      value: profileData.user.numberOfCompletedChallenges,
    },
    {
      imgSrc: "/img/ranks/12.png",
      label: "Podiums",
      value: profileData.user.numberOfPodiums,
    },
    {
      imgSrc: "/img/ranks/05.png",
      label: "First places",
      value: profileData.user.numberOfFirst,
    },
  ];

  return (
    <>
      <section className="my-20 block flex-row items-center justify-center gap-20 md:flex">
        <aside className="block flex flex-col items-center justify-center text-center">
          <div className="effect-container z-0">
            <h1 className="effect font-league text-center text-3xl">
              {profileData.user.name}
            </h1>
          </div>
          <Image width={300} height={300} src="/img/league-shield.png" />
          <p className="effect text-3xl">Captain</p>
        </aside>

        <ul className="mt-10 space-y-2 text-center md:mt-20 md:text-left">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="mx-auto flex flex-row items-center gap-2 md:text-left"
            >
              <Image width={50} height={50} src={stat.imgSrc} />
              {stat.label}: {stat.value}
            </li>
          ))}
          <li className="py-5 text-2xl">65p</li>
        </ul>
      </section>
    </>
  );
};

const Results: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout>
      {sessionData ? (
        <>
          <UserResults session={sessionData} />
          <div>
            <h2 className="text-2xl">Your past challenges</h2>
            <ChallengeList />
          </div>
        </>
      ) : (
        <button
          className="text-base text-black text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
          onClick={() => void signIn()}
        >
          Log in
        </button>
      )}
    </Layout>
  );
};

export default Results;