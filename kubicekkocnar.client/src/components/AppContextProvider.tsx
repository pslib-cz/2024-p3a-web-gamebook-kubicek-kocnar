import React, { useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import PlacedBlock from "../types/PlacedBlock";
import GenericFeature from "../types/Feature";
import { Inventory } from "../lib/Inventory";

interface AddBlockParams {
  blockId?: number;
  state?: string;
}

interface AppContextType {
  playerHealth: number;
  setPlayerHealth: (health: number) => void;
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
}

const defaultContext: AppContextType = {
  playerHealth: 100,
  setPlayerHealth: () => {},
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
};

const AppContext = React.createContext<AppContextType>(defaultContext);

function AppContextProvider({children}: {children: React.ReactNode}) {
    const [toolState, setToolState] = useState(Tool.List);
    const [blockState, setBlock] = useState<PlacedBlock|null>(null);
    const [featureState, setFeature] = useState<GenericFeature|null>(null);
    const [addBlockParamsState, setAddBlockParams] = useState<AddBlockParams|null>(null);
    const [playerInventory, setPlayerInventory] = useState<Inventory | null>(null);
    const [playerHealth, setPlayerHealth] = useState<number>(100);

    const contextValue = useMemo(() => ({
      setToolState, toolState, blockState, setBlock, featureState, setFeature, playerInventory, setPlayerInventory, setAddBlockParams, addBlockParamsState, playerHealth, setPlayerHealth
    }), [toolState, blockState, featureState, playerInventory, addBlockParamsState, playerHealth]);

    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};