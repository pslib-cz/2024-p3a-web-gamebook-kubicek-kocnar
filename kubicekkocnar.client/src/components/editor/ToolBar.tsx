import React, { useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import '../../styles/ToolBar.css';
import { MaterialSymbol, MaterialSymbolProps } from 'react-material-symbols';
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
        //console.log(e);
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

    function TooltipItem({ className, onClick, icon, text }: { className: string, onClick: () => void, icon: MaterialSymbolProps['icon'], text: string }) {
      return (
        <Tooltip>
          <TooltipTrigger className={className} onClick={onClick}>
            <MaterialSymbol icon={icon} size={24} fill />
          </TooltipTrigger>
          <TooltipContent>{text}</TooltipContent>
        </Tooltip>
      );
    }

    return (
        <>
        <div className={`crosshair${toolState != Tool.PlayerCamera ? ' crosshair--hidden' : ''}`}></div>
        <div className='toolbar'>
            <div className="toolbar__buttons">
                
                <TooltipItem 
                  className={`toolbar__button${toolState === Tool.List ? ' toolbar__button--active' : ''}`} 
                  onClick={() => setToolState(Tool.List)} 
                  icon="category" 
                  text="List" 
                  />

                {toolState === Tool.FeatureView && 
                <TooltipItem 
                  className="toolbar__button toolbar__button--active" 
                  onClick={() => setToolState(Tool.FeatureView)} 
                  icon="motion_mode" 
                  text="Feature View" 
                  />}

                <TooltipItem 
                  className={`toolbar__button${toolState === Tool.BlockList ? ' toolbar__button--active' : ''}`} 
                  onClick={() => setToolState(Tool.BlockList)} 
                  icon="view_in_ar" 
                  text="Block List" 
                  />

                {
                toolState === Tool.BlockEditor &&
                  <TooltipItem 
                    className="toolbar__button toolbar__button--active" 
                    onClick={() => setToolState(Tool.BlockEditor)} 
                    icon="edit_square" 
                    text="Block Editor" 
                    />
                }

                <TooltipItem 
                  className={`toolbar__button${toolState === Tool.Mouse ? ' toolbar__button--active' : ''}`} 
                  onClick={() => setToolState(Tool.Mouse)} 
                  icon="arrow_selector_tool" 
                  text="Mouse" 
                />

                <TooltipItem 
                  className={`toolbar__button${toolState === Tool.Add ? ' toolbar__button--active' : ''}`} 
                  onClick={() => setToolState(Tool.Add)} 
                  icon="add" 
                  text="Add" 
                />

                <TooltipItem 
                  className={`toolbar__button${toolState === Tool.Remove ? ' toolbar__button--active' : ''}`} 
                  onClick={() => setToolState(Tool.Remove)} 
                  icon="remove" 
                  text="Remove" 
                />

                <TooltipItem 
                  className={`toolbar__button${toolState === Tool.PlayerCamera ? ' toolbar__button--active' : ''}`} 
                  onClick={() => setToolState(Tool.PlayerCamera)} 
                  icon="video_camera_front" 
                  text="Player Camera" 
                />
            </div>
            <div className="toolbar__heading">

            </div>
        </div>
        </>
    );
};

export default ToolBar;
export { Tool };