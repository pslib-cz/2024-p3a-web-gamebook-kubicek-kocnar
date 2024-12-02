import React, { useContext, useState, useEffect } from 'react';
import '../../styles/ConfigPanel.css';
import { MaterialSymbol } from 'react-material-symbols';
import { AppContext } from '../AppContextProvider';
import MapRender from '../../lib/MapRenderer';
import MapRenderer from '../../lib/MapRenderer';
import { Tool } from './ToolBar';

const ConfigPanel: React.FC = () => {

    const { toolState, blockState } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // This effect will run whenever blockState changes
        console.log("Selected block changed:", blockState);
    }, [blockState]);

    const setConfigPanelView = () => {
        switch (toolState) {
            case Tool.Mouse:
                return (
                    <div className='configpanel__info'>
                        <h3>
                            {blockState?.block.name} {blockState?.placedBlockId}
                        </h3>
                        <p>
                            Attributes: {blockState?.block.attributes.join(', ')}
                        </p>

                        <p>
                            Position: <span className='coord--x'>{blockState?.position.x}</span>, <span className='coord--y'>{blockState?.position.y}</span>, <span className='coord--z'>{blockState?.position.z}</span>
                        </p>
                        <p>
                            Added at: {new Date(blockState?.created ?? 0).toLocaleString()}
                        </p>
                        <div>
                            <h4>Textures</h4>
                            <div className="configpanel__textures">
                            {[blockState?.block.texture0, blockState?.block.texture1, blockState?.block.texture2, blockState?.block.texture3, blockState?.block.texture4, blockState?.block.texture5].map((texture, index) => (
                                <div
                                key={index} 
                                className="configpanel__texture" 
                                >
                                {texture && <img className='configpanel__texture__image' src={URL.createObjectURL(MapRenderer.loadTexture(texture!))} alt={`texture ${index}`}/>}
                                <p className='configpanel__texture__side'>{MapRender.translateTextureSide(index)}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                );
            case Tool.Add:
                return (
                    <div className='configpanel__info'>
                        <h3>
                            Add block
                        </h3>
                    </div>
                );
            default: <></>
        }

    }

    return (
        
        <div className={`configpanel ${isOpen ? 'configpanel--open' : 'configpanel--closed'}`}>
            <button className="toggle-button" onClick={togglePanel}>
                {isOpen ? <MaterialSymbol icon='chevron_right' size={24}/> : <MaterialSymbol icon='chevron_left' size={24}/>}
            </button>
            {setConfigPanelView()}
        </div>
    );
};

export default ConfigPanel;