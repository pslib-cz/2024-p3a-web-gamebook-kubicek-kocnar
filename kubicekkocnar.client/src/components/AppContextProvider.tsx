import React, { MutableRefObject, useRef, useState, useMemo } from "react";
import { Tool } from "./editor/ToolBar";
import Block from "../types/Block";

interface AppContextType {
    tool: MutableRefObject<Tool>;
    toolState: Tool;
    setTool: (tool: Tool) => void;
    block: MutableRefObject<Block>;
    setBlock: (block: Block) => void;
    blockState: Block;
}

const defaultContext: AppContextType = {
    tool: {current: Tool.Mouse},
    toolState: Tool.Mouse,
    setTool: () => {},
    block: {current: {blockId: 0, position: [0, 0, 0]}},
    setBlock: () => {},
    blockState: {blockId: 0, position: [0, 0, 0]}
};

const AppContext = React.createContext<AppContextType>(defaultContext);

function AppContextProvider({children}: {children: React.ReactNode}) {
    const tool = useRef(Tool.Mouse);
    const [toolState, setToolState] = useState(Tool.Mouse);
    const setTool = (newTool: Tool) => {
        tool.current = newTool;
        setToolState(newTool);
    };

    const block = useRef<Block>({blockId: 0, position: [0, 0, 0]});
    const [blockState, setBlockState] = useState<Block>({blockId: 0, position: [0, 0, 0]});
    const setBlock = (newBlock: Block) => {
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