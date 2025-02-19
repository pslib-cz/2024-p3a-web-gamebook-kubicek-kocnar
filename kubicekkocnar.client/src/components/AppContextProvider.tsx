import React, { useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import PlacedBlock from "../types/PlacedBlock";
import GenericFeature from "../types/Feature";
import { JoystickOutputData } from "./game/Joystick";
import { EnemyRenderer } from "../lib/Enemy";
import { Player } from "../lib/Player/Player";

interface AddBlockParams {
  blockId?: number;
  state?: string;
}

interface AppContextType {
  toolState: Tool;
  setToolState: (tool: Tool) => void;
  setBlock: (block: PlacedBlock) => void;
  blockState: PlacedBlock|null;
  setFeature: (block: GenericFeature) => void;
  featureState: GenericFeature|null;

  player: Player | null;
  setPlayer: (player: Player) => void

  setAddBlockParams: (block: AddBlockParams) => void;
  addBlockParamsState: AddBlockParams|null;

  joytickData : JoystickOutputData | null;
  setJoystickData : (data: JoystickOutputData) => void;

  enemyHandler : EnemyRenderer | null;
  setEnemyHandler : (handler: EnemyRenderer) => void;
}

const defaultContext: AppContextType = {
  toolState: Tool.List,
  setToolState: () => {},
  setBlock: () => {},
  blockState: null,
  setFeature: () => {},
  featureState: null,

  player: null,
  setPlayer: () => {},

  setAddBlockParams: () => {},
  addBlockParamsState: null,

  joytickData: null,
  setJoystickData: () => {},

  enemyHandler: null,
  setEnemyHandler: () => {}
};

const AppContext = React.createContext<AppContextType>(defaultContext);

function AppContextProvider({children}: {children: React.ReactNode}) {
    const [toolState, setToolState] = useState(Tool.List);
    const [blockState, setBlock] = useState<PlacedBlock|null>(null);
    const [featureState, setFeature] = useState<GenericFeature|null>(null);
    const [addBlockParamsState, setAddBlockParams] = useState<AddBlockParams|null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [joytickData, setJoystickData] = useState<JoystickOutputData | null>(null);
    const [enemyHandler, setEnemyHandler] = useState<EnemyRenderer | null>(null);

    const contextValue = useMemo(() => ({
      setToolState, toolState, blockState, setBlock, featureState, setFeature, player, setPlayer, setAddBlockParams, addBlockParamsState, joytickData, setJoystickData, enemyHandler, setEnemyHandler
    }), [toolState, blockState, featureState, player, addBlockParamsState, joytickData, enemyHandler]);

    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};