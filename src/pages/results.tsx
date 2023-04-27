import { type NextPage } from "next";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import { Check } from "~/components/Icons/Check";
import { Hand } from "~/components/Icons/Hand";
import { Podium } from "~/components/Icons/Podium";
import { Medal } from "~/components/Icons/Medal";
import { api } from "~/utils/api";

// const getImgId = (rank: number) => {
//   let str = rank.toString();
//   if (str.length === 1) {
//     str = "0" + str;
//   }
//   return str;
// };

// const UserResults: React.FC<{ session: Session }> = ({ session }) => {
import Layout from "~/components/Layout";
import { ChallengeList } from "~/components/ChallengeList";
import { type Session } from "next-auth";

const UserResults: React.FC<{ session: Session }> = ({ session }) => {
  const { data: profileData } = api.challenges.getUserResults.useQuery({
    userId: session.user.id,
  });

  //   if (!profileData) {
  //     return <div>No profile</div>;
  //   }

  //   const imgId = getImgId(profileData.rank?.id || 1);

  //   console.log("DATA", profileData);

  //   return (
  //     <div>
  //       <h1 className="mb-10 mt-10 text-center text-7xl font-bold">
  //         {profileData?.name}
  //       </h1>
  //       <h2 className="mb-20 text-center text-4xl italic">
  //         {profileData.rank?.name}
  //       </h2>

  //       <div className="flex flex-row justify-between gap-20">
  //         <img src={`/img/ranks/${imgId}.png`} alt={`rank${imgId}`} />
  //         <div className="flex flex-col gap-2">
  //           <Line
  //             text="Challenges attended"
  //             num={profileData.numberOfAttendedChallenges}
  //             icon={<Hand />}
  //           />
  //           <Line
  //             text="Challenges completed"
  //             num={profileData.numberOfCompletedChallenges}
  //             icon={<Check />}
  //           />
  //           <Line
  //             text="Podiums"
  //             num={profileData.numberOfPodiums}
  //             icon={<Podium />}
  //           />
  //           <Line
  //             text="First places"
  //             num={profileData.numberOfFirst}
  //             icon={<Medal />}
  //           />
  //           <h2 className="text-4xl font-bold">{profileData.points}p</h2>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // const Line: React.FC<{ text: string; num: number; icon: React.ReactNode }> = ({
  //   text,
  //   num,
  //   icon,
  // }) => {
  //   return (
  //     <div className="flex flex-row items-center gap-2">
  //       {icon}
  //       <p className="text-2xl">
  //         {text}: <span className="font-bold">{num}</span>
  //       </p>
  //     </div>

  const stats = [
    {
      imgSrc: "/img/ranks/10.png",
      label: "Challenges attended",
      value: profileData?.numberOfAttendedChallenges,
    },
    {
      imgSrc: "/img/ranks/22.png",
      label: "Challenges completed",
      value: profileData?.numberOfCompletedChallenges,
    },
    {
      imgSrc: "/img/ranks/12.png",
      label: "Podiums",
      value: profileData?.numberOfPodiums,
    },
    {
      imgSrc: "/img/ranks/05.png",
      label: "First places",
      value: profileData?.numberOfFirst,
    },
  ];

  return (
    <>
      <section className="my-20 block flex-row items-center justify-center gap-20 md:flex">
        <aside className="block flex flex-col items-center justify-center text-center">
          <div className="effect-container z-0">
            <h1 className="effect text-center font-league text-3xl">
              {profileData?.name}
            </h1>
          </div>
          <Image
            width={300}
            height={300}
            src="/img/league-shield.png"
            alt="whatevs"
          />
          <p className="effect text-3xl">Captain</p>
        </aside>

        <ul className="mt-10 space-y-2 text-center md:mt-20 md:text-left">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="mx-auto flex flex-row items-center gap-2 md:text-left"
            >
              <Image width={50} height={50} src={stat.imgSrc} alt="whatevs" />
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
      {/* {sessionData ? <UserResults session={sessionData} /> : <div>Log in</div>} */}
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
