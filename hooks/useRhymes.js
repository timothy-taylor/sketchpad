import { useEffect, useState } from "react";

const testData = [
  { word: "staff", score: 2672, numSyllables: 1 },
  { word: "half", score: 1718, numSyllables: 1 },
  { word: "laugh", score: 1457, numSyllables: 1 },
  { word: "graph", score: 1443, numSyllables: 1 },
];

export const useRhymes = () => {
  const [rhymes, setRhymes] = useState([]);

  //
  // [{ words, score, numSyllables }, ...]
  const getRhymes = (str) => {
    // if (process.env.NODE_ENV === "development") return setRhymes(testData);

    fetch(`https://api.datamuse.com/words?rel_rhy=${str}&max=6`)
      .then((response) => response.json())
      .then((data) => setRhymes(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.log(rhymes);
  }, [rhymes]);

  return { rhymes, getRhymes };
};
