import React, { useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import '../../styles/ToolBar.css';
import { MaterialSymbol } from 'react-material-symbols';

enum Tool {
    List,
    FeatureView,
    Mouse,
    Add,
    Remove,
    PlayerCamera
}

const ToolBar: React.FC = () => {
    const { toolState, setTool } = useContext(AppContext);

    // add a keybord shortcut for switching tools (1, 2, 3, 4)
    const handleKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        
        switch (e.key) {
            case '1':
            case '+':
                setTool(Tool.List);
                break;
            case '2':
            case 'ě':
                setTool(Tool.Mouse);
                break;
            case '3':
            case 'š':
                setTool(Tool.Add);
                break;
            case '4':
            case 'č':
                setTool(Tool.Remove);
                break;
            case '5':
            case 'ř':
                setTool(Tool.PlayerCamera);
                break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    

    return (
        <>
        <div className={`crosshair${toolState != Tool.PlayerCamera ? ' crosshair--hidden' : ''}`}></div>
        <div className='toolbar'>
            <div className="toolbar__buttons">
                <button className={`toolbar__button${toolState === Tool.List ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.List)}><MaterialSymbol icon="category" size={24} fill/></button>
                {toolState === Tool.FeatureView && <button className="toolbar__button toolbar__button--active" onClick={() => setTool(Tool.FeatureView)}><MaterialSymbol icon="motion_mode" size={24} fill/></button>}
                <button className={`toolbar__button${toolState === Tool.Mouse ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.Mouse)}><MaterialSymbol icon="arrow_selector_tool" size={24} fill/></button>
                <button className={`toolbar__button${toolState === Tool.Add ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.Add)}><MaterialSymbol icon="add" size={24} fill/></button>
                <button className={`toolbar__button${toolState === Tool.Remove ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.Remove)}><MaterialSymbol icon="remove" size={24} fill/></button>
                <button className={`toolbar__button${toolState === Tool.PlayerCamera ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.PlayerCamera)}><MaterialSymbol icon="video_camera_front" size={24} fill/></button>
            </div>
            <div className="toolbar__heading">

            </div>
        </div>
        </>
    );
};

export default ToolBar;
export { Tool };