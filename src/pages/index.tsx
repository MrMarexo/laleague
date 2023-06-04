import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

import Layout from "~/components/Layout";

import { api, type RouterOutputs } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";
import format from "date-fns/format";
import { DoneCircle } from "~/components/Icons/DoneCircle";
import Link from "~/components/Link/Link";
import { getPositionShort } from "~/utils/fns";
import PodiumIcon from "~/components/Icons/PodiumIcon";
import { MyButton } from "~/components/MyButton";
import { Modal } from "~/components/Modal";

const scoringTable = [
  { arr: ["1st", "3"] },
  { arr: ["2nd", "2"] },
  { arr: ["3rd", "1"] },
];

type TaskStateProps = {
  id: string;
  isCompleted: boolean;
  isDescriptionOpen?: boolean;
  isConfirmOpen?: boolean;
};

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
          <MyButton onClick={() => void signIn()}>Complete</MyButton>
        </div>
      ))}
      <div className="mt-1 flex flex-row justify-center">
        <p className="font-bold">+{challengeData.extraPoints || 0}p</p>
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

  const [tasksState, setTasksState] = useState<Array<TaskStateProps>>([
    { id: "", isCompleted: false },
  ]);

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

  const handleApi = (
    takenId: string,
    challengeData: NonNullable<TasksFromUserChallenge>
  ) => {
    const found = tasksState?.find((task) => task.id === takenId);
    if (found) {
      mutateAsync({
        taskId: found.id,
        isCompleted: !found.isCompleted,
        userChallengeId: challengeData.id,
        challengeId: challengeData.challenge.id,
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

  const handleTaskStateBoolean = (
    index: number,
    isOpen: boolean,
    prop: "isConfirmOpen" | "isDescriptionOpen"
  ) => {
    setTasksState((current) => {
      return current.map((state, i) => {
        if (i === index) {
          state[prop] = isOpen;
          return state;
        }
        return state;
      });
    });
  };

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
        <div key={task.id}>
          <div className="relative flex flex-row items-center justify-between gap-6">
            <div className="effect-container relative flex items-center gap-2">
              <button
                onClick={() =>
                  handleTaskStateBoolean(i, true, "isDescriptionOpen")
                }
                onBlur={() =>
                  handleTaskStateBoolean(i, false, "isDescriptionOpen")
                }
                className=" effect mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-league-gray-6"
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
              <MyButton
                onClick={() => handleTaskStateBoolean(i, true, "isConfirmOpen")}
              >
                Complete
              </MyButton>
            )}
            <Modal
              isOpen={!!tasksState?.[i]?.isConfirmOpen}
              close={() => handleTaskStateBoolean(i, false, "isConfirmOpen")}
            >
              <p className="text-center text-sm">
                Are you sure you completed it?
              </p>
              <div className="flex gap-4">
                <MyButton onClick={() => handleApi(task.id, challengeData)}>
                  Yes
                </MyButton>
                <MyButton
                  onClick={() =>
                    handleTaskStateBoolean(i, false, "isConfirmOpen")
                  }
                >
                  Hmmm ...
                </MyButton>
              </div>
            </Modal>
          </div>
          <div className="flex items-center justify-between">
            <p>
              Difficulty: <i>{task.task.difficulty.name}</i>
            </p>
            <p className="font-bold">+{task.task.difficulty.points}p</p>
          </div>
        </div>
      ))}
      <div className="mt-4 flex flex-row justify-center">
        {isChallengeCompleted ? (
          <div className="flex flex-row items-center gap-1 text-sm font-bold">
            <DoneCircle />
            Challenge completed
          </div>
        ) : (
          <p className="font-bold">
            +{challengeData?.challenge.extraPoints || 0}p
          </p>
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
    const defaultItems = scoringTable.map(({ arr }) => (
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
              <p className="font-bold">{getPositionShort(index + 1)}</p>
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
              <p className="font-bold">
                +{index < 3 ? scoringTable[index]?.arr[1] : 0}p
              </p>
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
        <title>League</title>
        <meta
          name="description"
          content="Complete objectives and move up in ranks"
        />
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
            <PodiumIcon />
          </div>
          {getUsers()}
        </div>
      </Layout>
    </>
  );
};

export default Home;
