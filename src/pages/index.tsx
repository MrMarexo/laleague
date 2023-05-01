import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import Layout from "~/components/Layout";

import { api, type RouterOutputs } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";
import format from "date-fns/format";
import { DoneCircle } from "~/components/Icons/DoneCircle";
import Link from "~/components/Link/Link";

type TasksFromUserChallenge =
  RouterOutputs["challenges"]["getTasksFromLastChallenge"];

const skeleton = <div className="h-44 w-44" />;

const LoggedOutForm: React.FC = () => {
  const { data: challengeData } = api.challenges.getCurrentChallenge.useQuery();

  if (!challengeData) {
    return skeleton;
  }

  return (
    <>
      <h3>
        Title: <span className="font-bold">{challengeData.title}</span>
      </h3>
      <p className="mb-1">
        Ends:{" "}
        <span className="italic">
          {format(challengeData.endDate, "MMM do")}
        </span>
      </p>
      <div className="min-w-full border-b border-black dark:border-white" />

      {challengeData.tasks.map((task) => (
        <div key={task.id} className="flex flex-row justify-between gap-10">
          <p>{task.title}</p>
          <button
            onClick={() => void signIn()}
            className="duration-400 rounded border border-black bg-transparent px-4 py-1 text-xs font-semibold transition-all hover:bg-black hover:text-white dark:border-white"
          >
            Complete
          </button>
        </div>
      ))}
      <div className="mt-1 flex flex-row justify-center">
        <p className="font-bold">+{challengeData.point || 0}p</p>
      </div>
    </>
  );
};

const LoggedInForm: React.FC<{
  setAllCompleted: (isChallengeCompleted: boolean) => void;
}> = ({ setAllCompleted }) => {
  const { refetch, data: challengeData } =
    api.challenges.getTasksFromLastChallenge.useQuery(undefined, {
      enabled: false,
    });

  // const handleInfo = (index: number) => {};

  const { mutateAsync } = api.challenges.setTaskValues.useMutation();

  const [isChallengeCompleted, setChallengeCompleted] = useState(false);

  const [tasksState, setTasksState] = useState<
    Array<{ id: string; isCompleted: boolean; isDescriptionOpen?: boolean }>
  >([{ id: "", isCompleted: false }]);

  useEffect(() => {
    const allTasksAreCompleted = tasksState?.every((item) => item.isCompleted);
    setChallengeCompleted(!!allTasksAreCompleted);
    setAllCompleted(!!allTasksAreCompleted);
  }, [tasksState, setAllCompleted]);

  useEffect(() => {
    refetch()
      .then(({ data }) => {
        if (data) {
          setTasksState(
            data?.userChallengeTasks.map((t) => ({
              id: t.id,
              isCompleted: !!t.taskCompletedAt,
            }))
          );
          setChallengeCompleted(!!data.dateCompleted);
        }
      })
      .catch((e) => {
        console.error("GET CHALLENGE FAILED WITH ERRROR", e);
      });
  }, [refetch]);

  const handleButton = (
    takenId: string,
    challengeData: NonNullable<TasksFromUserChallenge>
  ) => {
    const found = tasksState?.find((task) => task.id === takenId);
    if (found) {
      mutateAsync({
        taskId: found.id,
        isCompleted: !found.isCompleted,
        userChallengeId: challengeData.id,
      })
        .then((res) => {
          if (res) {
            setTasksState((old) => {
              if (old) {
                const newState = old.map((value) => {
                  if (value.id === takenId) {
                    return { id: value.id, isCompleted: !value.isCompleted };
                  }
                  return value;
                });
                return newState;
              }
              return old;
            });
          }
        })
        .catch((e) => {
          console.error("SET TASK ERROR", e);
        });
    }
  };

  const handleDescription = (index: number, isOpen: boolean) => {
    console.log("HANDLE RUNS");
    setTasksState((current) => {
      return current.map((state, i) => {
        if (i === index) {
          state.isDescriptionOpen = isOpen;
          return state;
        }
        return state;
      });
    });
  };

  console.log("STATE", tasksState);

  if (!challengeData) {
    return skeleton;
  }

  return (
    <>
      <h3>
        Title:{" "}
        <span className="font-bold">{challengeData.challenge.title}</span>
      </h3>
      <p className="mb-1">
        Ends:{" "}
        <span className="italic">
          {format(challengeData.challenge.endDate, "MMM do")}
        </span>
      </p>
      <div className="min-w-full border-b border-black dark:border-white" />
      {challengeData.userChallengeTasks.map((task, i) => (
        <div
          key={task.id}
          className="flex flex-row items-center justify-between gap-10"
        >
          <div className="effect-container relative flex items-center gap-2">
            <button
              onClick={() => handleDescription(i, true)}
              onBlur={() => handleDescription(i, false)}
              className="effect mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-league-gray-800"
            >
              <p>i</p>
            </button>
            <p>{task.task.title}</p>
            <div
              className={`left-1/5 absolute bottom-6 ${
                tasksState?.[i]?.isDescriptionOpen ? "" : "hidden"
              } rounded border border-black bg-white px-4 py-2 dark:border-white dark:bg-black`}
            >
              <p className="text-sm">{task.task.description}</p>
            </div>
          </div>
          {tasksState?.find((state) => state.id === task.id)?.isCompleted ? (
            <div className="flex flex-row items-center gap-1">
              <DoneCircle />
              <p className="text-sm font-bold">Done</p>
            </div>
          ) : (
            <button
              onClick={() => handleButton(task.id, challengeData)}
              className="duration-400 rounded border  border-black bg-transparent px-3 py-1 text-xs font-semibold transition-all hover:bg-black hover:text-white dark:border-white"
            >
              Complete
            </button>
          )}
        </div>
      ))}
      <div className="mt-4 flex flex-row justify-center">
        {isChallengeCompleted ? (
          <div className="flex flex-row items-center gap-1 text-sm font-bold">
            <DoneCircle />
            Challenge completed
          </div>
        ) : (
          <p className="font-bold">+{challengeData?.challenge.point || 0}p</p>
        )}
      </div>
    </>
  );
};

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const [isChallengeComplete, setIsChallengeComplete] = useState(false);
  const { refetch, data: completedUsersData } =
    api.challenges.getCompletedUsers.useQuery(undefined, {
      enabled: false,
    });

  useEffect(() => {
    void refetch();
  }, []);

  useEffect(() => {
    if (isChallengeComplete) {
      void refetch();
    }
  }, [isChallengeComplete]);

  const getUsers = () => {
    const defaultItems = [
      { arr: ["1st", "3"] },
      { arr: ["2nd", "2"] },
      { arr: ["3rd", "1"] },
    ].map(({ arr }) => (
      <div
        key={arr[0]}
        className="flex flex-row justify-between gap-6 text-gray-400"
      >
        <p className="font-bold">{arr[0]}</p>
        <p>No one yet</p>
        <p className="font-bold">+{arr[1]}p</p>
      </div>
    ));
    if (completedUsersData) {
      const userItems = completedUsersData.map(
        ({ user, dateCompleted }, index) => {
          const isMe = sessionData && sessionData.user.id === user.id;
          return (
            <div key={index} className="flex flex-row justify-between gap-6">
              <p className="font-bold">1st</p>
              <p>
                {isMe ? (
                  <i>
                    <Link href="/results">{user.name}</Link>
                  </i>
                ) : (
                  <Link href={`/results/${user.id}`}>{user.name}</Link>
                )}{" "}
                - {format(dateCompleted!, "PP kk:mm")}
              </p>
              <p className="font-bold">+3p</p>
            </div>
          );
        }
      );
      for (let i = 0; i < defaultItems.length; i++) {
        if (!userItems[i]) {
          userItems[i] = defaultItems[i]!;
        }
      }
      return userItems;
    }
    return defaultItems;
  };

  return (
    <>
      <Head>
        <title>League homepage</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isWithBoxers>
        <div className="effect-container">
          <h1 className="effect dark:text my-8 font-league text-7xl md:text-9xl">
            Le<span className="pl-1">a</span>gue
          </h1>
        </div>
        <h2 className="mb-4 text-xl">Weekly challenge</h2>
        <div className="mb-14 flex flex-col gap-2 rounded-lg border-2 border-black px-4 py-4 dark:border-white">
          {sessionData ? (
            <LoggedInForm
              setAllCompleted={(isChallengeComplete) =>
                setIsChallengeComplete(isChallengeComplete)
              }
            />
          ) : (
            <LoggedOutForm />
          )}
        </div>
        <h2 className="mb-4 text-center text-xl">
          Who completed this challenge already?
        </h2>
        <div className="mb-10 flex flex-col gap-4 rounded-lg border-2 border-black px-8 py-4 dark:border-white">
          <div className="flex flex-row justify-center">
            <Image
              src="/img/podium.png"
              alt="podium"
              width={100}
              height={150}
            />
          </div>
          {getUsers()}
        </div>
      </Layout>
    </>
  );
};

export default Home;
