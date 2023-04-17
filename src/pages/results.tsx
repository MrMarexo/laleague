import { type NextPage } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import Layout from "~/components/Layout/Layout";
import { api } from "~/utils/api";

const UserResults: React.FC<{ session: Session }> = ({ session }) => {
  const { data: profileData } = api.challenges.getUserResults.useQuery({
    userId: session.user.id,
  });

  console.log("DATA", profileData);

  return <div>data</div>;
};

const Results: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout>
      <div>results</div>
      {sessionData ? <UserResults session={sessionData} /> : <div>Log in</div>}
    </Layout>
  );
};

export default Results;
