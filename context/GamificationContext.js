import React, { createContext, useState } from 'react';

export const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [xp, setXp] = useState(0);
  const [bits, setBits] = useState(0);
  const [streak, setStreak] = useState(0);

  const addXp = (amount) => {
    setXp((prevXp) => prevXp + amount);
  };

  const addBits = (amount) => {
    setBits((prevBits) => prevBits + amount);
  };

  const incrementStreak = () => {
    setStreak((prevStreak) => prevStreak + 1);
  };

  return (
    <GamificationContext.Provider value={{ xp, bits, streak, addXp, addBits, incrementStreak }}>
      {children}
    </GamificationContext.Provider>
  );
};