import React, { MutableRefObject, useRef, useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import PlacedBlock from "../types/PlacedBlock";
import GenericFeature from "../types/Feature";
import { Inventory } from "../lib/Inventory";

interface AddBlockParams {
  blockId?: number;
  state?: string;
}

interface AppContextType {
  tool: MutableRefObject<Tool>;
  toolState: Tool;
  setTool: (tool: Tool) => void;
  block: MutableRefObject<PlacedBlock|null>;
  setBlock: (block: PlacedBlock) => void;
  blockState: PlacedBlock|null;
  feature: MutableRefObject<GenericFeature|null>;
  setFeature: (block: GenericFeature) => void;
  featureState: GenericFeature|null;

  playerInventory: Inventory | null;
  setPlayerInventory: (inventory: Inventory) => void

  addBlockParams: MutableRefObject<AddBlockParams|null>;
  setAddBlockParams: (block: AddBlockParams) => void;
  addBlockParamsState: AddBlockParams|null;
}

const defaultContext: AppContextType = {
  tool: {current: Tool.List},
  toolState: Tool.List,
  setTool: () => {},
  block: {current: null},
  setBlock: () => {},
  blockState: null,
  setFeature: () => {},
  featureState: null,
  feature: {current: null},

  playerInventory: null,
  setPlayerInventory: () => {},

  addBlockParams: {current: null},
  setAddBlockParams: () => {},
  addBlockParamsState: null,
};

const AppContext = React.createContext<AppContextType>(defaultContext);

function AppContextProvider({children}: {children: React.ReactNode}) {
    const tool = useRef(Tool.List);
    const [toolState, setToolState] = useState(Tool.List);
    const setTool = (newTool: Tool) => {
      tool.current = newTool;
      setToolState(newTool);
    };

    const block = useRef<PlacedBlock | null>(null);
    const [blockState, setBlockState] = useState<PlacedBlock|null>(null);
    const setBlock = (newBlock: PlacedBlock) => {
      block.current = newBlock;
      setBlockState(newBlock);
    };

    const feature = useRef<GenericFeature|null>(null);
    const [featureState, setFeatureState] = useState<GenericFeature|null>(null);
    const setFeature = (newFeature: GenericFeature) => {
      feature.current = newFeature;
      setFeatureState(newFeature);
    };

    const addBlockParams = useRef<AddBlockParams|null>(null);
    const [addBlockParamsState, setAddBlockState] = useState<AddBlockParams|null>(null);
    const setAddBlockParams = (newBlock: AddBlockParams) => {
      addBlockParams.current = newBlock;
      setAddBlockState(newBlock);
    };

    const [playerInventory, setPlayerInventory] = useState<Inventory | null>(null);

    const contextValue = useMemo(() => ({
      tool, setTool, toolState, block, blockState, setBlock, feature, featureState, setFeature, playerInventory, setPlayerInventory, addBlockParams, setAddBlockParams, addBlockParamsState
    }), [toolState, blockState, featureState, playerInventory, addBlockParamsState]);

    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};