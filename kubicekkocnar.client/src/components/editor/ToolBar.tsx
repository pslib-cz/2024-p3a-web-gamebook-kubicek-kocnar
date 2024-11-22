import React, { useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import '../../styles/ToolBar.css';
import { MaterialSymbol } from 'react-material-symbols';

enum Tool {
    Mouse,
    Add,
    Remove
}

const ToolBar: React.FC = () => {
    const { toolState, setTool } = useContext(AppContext);

    return (
        <div className='toolbar'>
            <button className={`toolbar__button${toolState === Tool.Mouse ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.Mouse)}><MaterialSymbol icon="arrow_selector_tool" size={24} fill/></button>
            <button className={`toolbar__button${toolState === Tool.Add ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.Add)}><MaterialSymbol icon="add" size={24} fill/></button>
            <button className={`toolbar__button${toolState === Tool.Remove ? ' toolbar__button--active' : ''}`} onClick={() => setTool(Tool.Remove)}><MaterialSymbol icon="remove" size={24} fill/></button>
        </div>
    );
};

export default ToolBar;
export { Tool };