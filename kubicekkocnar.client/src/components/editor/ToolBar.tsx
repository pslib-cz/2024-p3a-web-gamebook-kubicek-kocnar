import React, { useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import '../../styles/ToolBar.css';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';

enum Tool {
    List,
    FeatureView,
    BlockList,
    BlockEditor,
    Mouse,
    Add,
    Remove,
    PlayerCamera
}

const ToolBar: React.FC = () => {
    const { toolState, setToolState } = useContext(AppContext);

    // add a keybord shortcut for switching tools (1, 2, 3, 4)
    const handleKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        // dont switch tools when typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        
        switch (e.key) {
            case '1':
            case '+':
                setToolState(Tool.List);
                break;
            case '2':
            case 'ě':
                setToolState(Tool.BlockList);
                break;
            case '3':
            case 'š':
                setToolState(Tool.Mouse);
                break;
            case '4':
            case 'č':
                setToolState(Tool.Add);
                break;
            case '5':
            case 'ř':
                setToolState(Tool.Remove);
                break;
            case '6':
            case 'ž':
                setToolState(Tool.PlayerCamera);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    

    return (
        <>
        <div className={`crosshair${toolState != Tool.PlayerCamera ? ' crosshair--hidden' : ''}`}></div>
        <div className='toolbar'>
            <div className="toolbar__buttons">
                
                <Tooltip><TooltipTrigger className={`toolbar__button${toolState === Tool.List ? ' toolbar__button--active' : ''}`} onClick={() => setToolState(Tool.List)}><MaterialSymbol icon="category" size={24} fill/>
                </TooltipTrigger><TooltipContent>List</TooltipContent></Tooltip>
                {toolState === Tool.FeatureView && 
                <Tooltip><TooltipTrigger className="toolbar__button toolbar__button--active" onClick={() => setToolState(Tool.FeatureView)}><MaterialSymbol icon="motion_mode" size={24} fill/>
                </TooltipTrigger><TooltipContent>Feature View</TooltipContent></Tooltip>}
                <Tooltip><TooltipTrigger className={`toolbar__button${toolState === Tool.BlockList ? ' toolbar__button--active' : ''}`} onClick={() => setToolState(Tool.BlockList)}><MaterialSymbol icon="view_in_ar" size={24} fill/>
                </TooltipTrigger><TooltipContent>Block List</TooltipContent></Tooltip>
                {toolState === Tool.BlockEditor &&
                <Tooltip><TooltipTrigger className="toolbar__button toolbar__button--active" onClick={() => setToolState(Tool.BlockEditor)}><MaterialSymbol icon="edit_square" size={24} fill/>
                </TooltipTrigger><TooltipContent>Block Editor</TooltipContent></Tooltip>}
                <Tooltip><TooltipTrigger className={`toolbar__button${toolState === Tool.Mouse ? ' toolbar__button--active' : ''}`} onClick={() => setToolState(Tool.Mouse)}><MaterialSymbol icon="arrow_selector_tool" size={24} fill/>
                </TooltipTrigger><TooltipContent>Mouse</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger className={`toolbar__button${toolState === Tool.Add ? ' toolbar__button--active' : ''}`} onClick={() => setToolState(Tool.Add)}><MaterialSymbol icon="add" size={24} fill/>
                </TooltipTrigger><TooltipContent>Add</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger className={`toolbar__button${toolState === Tool.Remove ? ' toolbar__button--active' : ''}`} onClick={() => setToolState(Tool.Remove)}><MaterialSymbol icon="remove" size={24} fill/>
                </TooltipTrigger><TooltipContent>Remove</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger className={`toolbar__button${toolState === Tool.PlayerCamera ? ' toolbar__button--active' : ''}`} onClick={() => setToolState(Tool.PlayerCamera)}><MaterialSymbol icon="video_camera_front" size={24} fill/>
                </TooltipTrigger><TooltipContent>Player Camera</TooltipContent></Tooltip>
            </div>
            <div className="toolbar__heading">

            </div>
        </div>
        </>
    );
};

export default ToolBar;
export { Tool };