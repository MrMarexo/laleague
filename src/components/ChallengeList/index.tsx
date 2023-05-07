import React from "react";
import { api } from "~/utils/api";
import { format } from "date-fns";
import { DoneCircle } from "../Icons/DoneCircle";
import { getPositionShort } from "~/utils/fns";

export const ChallengeList: React.FC = () => {
  const { data: challenges } =
    api.challenges.getMyPreviousChallenges.useQuery();

  const heading = <h2 className="mt-10 text-2xl">My previous challenges</h2>;

  if (!challenges || challenges?.length === 0) {
    return (
      <>
        {heading}
        <p className="mt-4">It&apos;s my first now...</p>
      </>
    );
  }

  return (
    <>
      {heading}
      <section className="my-4 grid grid-cols-1 gap-x-5 gap-y-6 dark:text-white md:grid-cols-2 lg:grid-cols-3">
        {challenges.map(
          ({
            placement,
            challenge: { endDate, title },
            userChallengeTasks,
          }) => (
            <article
              className="flex flex-col justify-between space-y-3 rounded-lg border-2 border-black p-4 dark:border-gray-400"
              key={title}
            >
              <h3 className="font-bold">{title}</h3>

              <ul>
                {userChallengeTasks.map(
                  ({ task, taskCompletedAt }, index: number) => (
                    <li
                      className={
                        !!taskCompletedAt ? "text-black-800" : "text-gray-400"
                      }
                      key={index}
                    >
                      {index + 1}. {task.title}
                    </li>
                  )
                )}
              </ul>
              <span className="flex flex-row">
                <p className="mr-6">Ended: </p>
                {format(endDate, "PP kk:mm")}
              </span>
              <span className="flex items-center justify-between">
                {!!placement ? (
                  <>
                    <div className="flex flex-row items-center gap-1">
                      <DoneCircle />
                      <p className="text-sm font-bold">Done</p>
                    </div>
                    <p className="font-bold">{getPositionShort(placement)}</p>
                  </>
                ) : (
                  <p className="font-bold">Not completed</p>
                )}
              </span>
            </article>
          )
        )}
      </section>
    </>
  );
};
