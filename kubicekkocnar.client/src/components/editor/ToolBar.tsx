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
  PlayerCamera,
  PathFinding
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

  function TooltipItem(
    { icon, text, tool }: 
    { icon: MaterialSymbolProps['icon'], text: string, tool: Tool }
  ) {
    return (
      <Tooltip>
        <TooltipTrigger 
          className={`toolbar__button${toolState === tool ? ' toolbar__button--active' : ''}`} 
          onClick={() => setToolState(tool)}
        >
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
            icon="category"
            text="List"
            tool={Tool.List}
          />

          {toolState === Tool.FeatureView &&
            <TooltipItem
              icon="motion_mode"
              text="Feature View"
              tool={Tool.FeatureView}
            />}

          <TooltipItem
            icon="view_in_ar"
            text="Block List"
            tool={Tool.BlockList}
          />

          {
            // toolState === Tool.BlockEditor &&
            <TooltipItem
              icon="edit_square"
              text="Block Editor"
              tool={Tool.BlockEditor}
            />
          }

          <TooltipItem
            icon="arrow_selector_tool"
            text="Mouse"
            tool={Tool.Mouse}
          />

          <TooltipItem
            icon="add"
            text="Add"
            tool={Tool.Add}
          />

          <TooltipItem
            icon="remove"
            text="Remove"
            tool={Tool.Remove}
          />

          <TooltipItem
            icon="video_camera_front"
            text="Player Camera"
            tool={Tool.PlayerCamera}
          />

          <TooltipItem
            icon="video_camera_front"
            text="Path Finding"
            tool={Tool.PathFinding}
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