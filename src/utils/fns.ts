export const calculatePoints = (completedChallengesLength: number) => {
  let extraPoints = 0;

  if (completedChallengesLength === 0) {
    extraPoints = 3;
  }
  if (completedChallengesLength === 1) {
    extraPoints = 2;
  }
  if (completedChallengesLength === 3) {
    extraPoints = 1;
  }
  return { placement: completedChallengesLength + 1, extraPoints };
};

export const getImgIdFromRankId = (rank: number) => {
  let str = rank.toString();
  if (str.length === 1) {
    str = "0" + str;
  }
  return str;
};
