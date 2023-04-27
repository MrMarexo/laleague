import React from "react";
import { data } from "./data";

type Task = {
  task: string;
};

type Challenge = {
  title: string;
  points: number;
  tasks: Task[];
  winner: string;
  winnerPoints: number;
};

export const ChallengeList: React.FC = () => {
  return (
    <section className="my-10 grid grid-cols-1 gap-y-6 gap-x-5 dark:text-white md:grid-cols-2 lg:grid-cols-3">
      {data.map(({ title, points, tasks, winner, winnerPoints }: Challenge) => (
        <article
          className="flex flex-col justify-between space-y-3 rounded-lg border-2 border-black p-4 dark:border-gray-400"
          key={title}
        >
          <h3 className="font-bold">{title}</h3>

          <span className="flex items-center justify-between">
            <p>Won:</p>
            <span className="flex items-center justify-between">
              🏆 {winner} {winnerPoints}
            </span>
          </span>

          <ul>
            {tasks.map(({ task }: Task, index: number) => (
              <li className="text-gray-400" key={task}>
                {index + 1}. {task}
              </li>
            ))}
          </ul>
          <span className="flex items-center justify-between">
            <p>Your points: {points}</p>
            <button
              onClick={() => alert("Challenged!")}
              className="duration-400 rounded border border-black bg-transparent px-4 py-1 text-xs font-semibold transition-all hover:bg-black hover:text-white dark:border-white"
            >
              Challenge Winner
            </button>
          </span>
        </article>
      ))}
    </section>
  );
};