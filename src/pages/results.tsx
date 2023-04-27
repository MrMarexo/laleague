import { type NextPage } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { Check } from "~/components/Icons/Check";
import { Hand } from "~/components/Icons/Hand";
import { Podium } from "~/components/Icons/Podium";
import { Medal } from "~/components/Icons/Medal";
import Layout from "~/components/Layout/Layout";
import { api } from "~/utils/api";

const getImgId = (rank: number) => {
  let str = rank.toString();
  if (str.length === 1) {
    str = "0" + str;
  }
  return str;
};

const UserResults: React.FC<{ session: Session }> = ({ session }) => {
  const { data: profileData } = api.challenges.getUserResults.useQuery({
    userId: session.user.id,
  });

  if (!profileData) {
    return <div>No profile</div>;
  }

  const imgId = getImgId(profileData.rank?.id || 1);

  console.log("DATA", profileData);

  return (
    <div>
      <h1 className="mb-10 mt-10 text-center text-7xl font-bold">
        {profileData?.name}
      </h1>
      <h2 className="mb-20 text-center text-4xl italic">
        {profileData.rank?.name}
      </h2>

      <div className="flex flex-row justify-between gap-20">
        <img src={`/img/ranks/${imgId}.png`} alt={`rank${imgId}`} />
        <div className="flex flex-col gap-2">
          <Line
            text="Challenges attended"
            num={profileData.numberOfAttendedChallenges}
            icon={<Hand />}
          />
          <Line
            text="Challenges completed"
            num={profileData.numberOfCompletedChallenges}
            icon={<Check />}
          />
          <Line
            text="Podiums"
            num={profileData.numberOfPodiums}
            icon={<Podium />}
          />
          <Line
            text="First places"
            num={profileData.numberOfFirst}
            icon={<Medal />}
          />
          <h2 className="text-4xl font-bold">{profileData.points}p</h2>
        </div>
      </div>
    </div>
  );
};

const Line: React.FC<{ text: string; num: number; icon: React.ReactNode }> = ({
  text,
  num,
  icon,
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {icon}
      <p className="text-2xl">
        {text}: <span className="font-bold">{num}</span>
      </p>
    </div>
  );
};

const Results: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout>
      {sessionData ? <UserResults session={sessionData} /> : <div>Log in</div>}
    </Layout>
  );
};

export default Results;
