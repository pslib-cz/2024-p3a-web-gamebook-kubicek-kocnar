import React, { useCallback, useMemo, useState } from "react";

interface GameContextType {
    playerHealth: number;
    setPlayerHealth: (health: number) => void;
    addPlayerHealth: (health: number) => void;
}

const defaultContext = {
    playerHealth: 100,
    setPlayerHealth: () => {},
    addPlayerHealth: () => {},
};

const GameContext = React.createContext<GameContextType>(defaultContext);

function GameContextProvider({children}: {children: React.ReactNode}) {
    const [playerHealth, setPlayerHealth] = useState<number>(100);
    const addPlayerHealth = useCallback((health: number) => {
        setPlayerHealth(playerHealth + health);
    }, [playerHealth]);

    const contextValue = useMemo(() => ({
        playerHealth, setPlayerHealth, addPlayerHealth
    }), [addPlayerHealth, playerHealth]);

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}

export { GameContext, GameContextProvider };
