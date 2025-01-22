import React, { useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import PlacedBlock from "../types/PlacedBlock";
import GenericFeature from "../types/Feature";
import { Inventory } from "../lib/Inventory";
import { JoystickOutputData } from "./game/Joystick";
import { EnemyRenderer } from "../lib/Enemy";

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

  playerInventory: Inventory | null;
  setPlayerInventory: (inventory: Inventory) => void

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

  playerInventory: null,
  setPlayerInventory: () => {},

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
    const [playerInventory, setPlayerInventory] = useState<Inventory | null>(null);
    const [joytickData, setJoystickData] = useState<JoystickOutputData | null>(null);
    const [enemyHandler, setEnemyHandler] = useState<EnemyRenderer | null>(null);

    const contextValue = useMemo(() => ({
      setToolState, toolState, blockState, setBlock, featureState, setFeature, playerInventory, setPlayerInventory, setAddBlockParams, addBlockParamsState, joytickData, setJoystickData, enemyHandler, setEnemyHandler
    }), [toolState, blockState, featureState, playerInventory, addBlockParamsState, joytickData, enemyHandler]);

    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};