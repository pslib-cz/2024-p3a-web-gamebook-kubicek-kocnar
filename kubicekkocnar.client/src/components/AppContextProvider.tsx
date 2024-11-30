import React, { MutableRefObject, useRef, useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import PlacedBlock from "../types/PlacedBlock";

interface AppContextType {
    tool: MutableRefObject<Tool>;
    toolState: Tool;
    setTool: (tool: Tool) => void;
    block: MutableRefObject<PlacedBlock|null>;
    setBlock: (block: PlacedBlock) => void;
    blockState: PlacedBlock|null;
}

const defaultContext: AppContextType = {
    tool: {current: Tool.Mouse},
    toolState: Tool.Mouse,
    setTool: () => {},
    block: {current: null},
    setBlock: () => {},
    blockState: null
};

const AppContext = React.createContext<AppContextType>(defaultContext);

function AppContextProvider({children}: {children: React.ReactNode}) {
    const tool = useRef(Tool.Mouse);
    const [toolState, setToolState] = useState(Tool.Mouse);
    const setTool = (newTool: Tool) => {
        tool.current = newTool;
        setToolState(newTool);
    };

    const block = useRef<PlacedBlock>(null);
    const [blockState, setBlockState] = useState<PlacedBlock|null>(null);
    const setBlock = (newBlock: PlacedBlock) => {
        //@ts-expect-error idk what's wrong here
        block.current = newBlock;
        setBlockState(newBlock);
    };

    const contextValue = useMemo(() => ({
        tool, setTool, toolState, block, blockState, setBlock
    }), [toolState, blockState]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};