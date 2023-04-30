import { type NextPage } from "next";
import Layout from "~/components/Layout";
import { UserResults } from ".";
import { useRouter } from "next/router";

const ResultsPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <Layout>
      <UserResults userId={query.id as string} />
    </Layout>
  );
};

export default ResultsPage;
