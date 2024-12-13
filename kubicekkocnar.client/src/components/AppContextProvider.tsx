import React, { MutableRefObject, useRef, useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import PlacedBlock from "../types/PlacedBlock";
import GenericFeature from "../types/Feature";
import { Inventory } from "../lib/Inventory";

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

    playerInventory: MutableRefObject<Inventory | null>;
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

  playerInventory: {current: null}
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

    const playerInventory = useRef<Inventory | null>(null);

    const contextValue = useMemo(() => ({
      tool, setTool, toolState, block, blockState, setBlock, feature, featureState, setFeature, playerInventory
    }), [toolState, blockState, featureState]);

    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};