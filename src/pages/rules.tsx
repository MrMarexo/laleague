import { type NextPage } from "next/types";
import Layout from "~/components/Layout";

const Rules: NextPage = () => (
  <Layout>
    <div className="effect-container z-0 my-10">
      <h1 className="effect my-4 text-center font-league text-5xl">rules</h1>
    </div>
    <p className="mb-8 mt-4">Welcome to the Fitness Challenge App!</p>
    <ol className="list-decimal space-y-2">
      <li>
        <b>Weekly Challenge:</b> Every week on Monday, a new challenge will be
        generated for all users. Each challenge consists of three tasks of
        different difficulty levels: Beginner, Medium, and Beast.
      </li>
      <li>
        <b>Task Types:</b> There are four types of fitness tasks in each
        challenge:
        <ul>
          <li>
            a. Strength: Focuses on exercises that enhance your strength and
            muscle development.
          </li>
          <li>
            b. Endurance: Involves activities that improve your cardiovascular
            endurance and stamina.
          </li>
          <li>
            c. Agility: Includes exercises that enhance your flexibility,
            coordination, and balance.
          </li>
          <li>
            d. Other: This category involves various sport activities that
            contribute to overall fitness.
          </li>
        </ul>
      </li>
      <li>
        <b>Additional info:</b> Click the circular &apos;i&apos; button next to
        each task to see additional information about the task.
      </li>
      <li>
        <b>Earning Points:</b> By completing each task, you earn points based on
        its difficulty level and type. Beast tasks reward more points than
        Medium, and Medium tasks reward more points than Beginner.
      </li>
      <li>
        <b>Bonus Points:</b> If you successfully complete all three tasks in the
        weekly challenge, you earn additional bonus points.
      </li>
      <li>
        <b>Ranking System:</b> Your total points determine your rank on the
        leaderboard. The more points you accumulate, the higher you&apos;ll
        climb in the ranks.
      </li>
      <li>
        <b>Fair Play:</b> Remember, this app relies on your word and honor, as
        there&apos;s no way for us to verify your results. We trust our
        community to complete tasks honestly and fairly. It&apos;s not only
        essential for a level playing field but also adds more fun and meaning
        to your fitness journey when you stay true to your achievements.
        Let&apos;s challenge ourselves together and celebrate our progress with
        integrity!
      </li>
      <li>
        <b>Fitness Focus:</b> All tasks are fitness-oriented, and the challenges
        are designed to promote a well-rounded workout experience.
      </li>
      <li>
        <b>Have Fun and Stay Safe:</b> The primary goal of the app is to
        encourage fitness and healthy living. Listen to your body and avoid
        tasks that might pose a risk to your health or well-being.
      </li>
    </ol>
  </Layout>
);

export default Rules;
