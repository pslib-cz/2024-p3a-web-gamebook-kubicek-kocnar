import React, { useContext, useState, useEffect } from 'react';
import '../../styles/ConfigPanel.css';
import { MaterialSymbol } from 'react-material-symbols';
import { AppContext } from '../AppContextProvider';
import MapRender from '../../lib/MapRenderer';

const ConfigPanel: React.FC = () => {

    const { blockState } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // This effect will run whenever blockState changes
        console.log("Selected block changed:", blockState);
    }, [blockState]);

    return (
        
        <div className={`configpanel ${isOpen ? 'configpanel--open' : 'configpanel--closed'}`}>
            <button className="toggle-button" onClick={togglePanel}>
                {isOpen ? <MaterialSymbol icon='chevron_right' size={24}/> : <MaterialSymbol icon='chevron_left' size={24}/>}
            </button>
            <div>
              <h3>
                  {blockState?.mesh?.geometry.type} {blockState?.blockId}
              </h3>
              <p>
                  Name: {blockState?.mesh?.name}
              </p>
              <p>
                  Position: {blockState?.position.x}, {blockState?.position.y}, {blockState?.position.z}
              </p>
              <div>
                  <h4>Textures</h4>
                  <div className="configpanel__textures">
                    {[blockState?.block.texture0, blockState?.block.texture1, blockState?.block.texture2, blockState?.block.texture3, blockState?.block.texture4, blockState?.block.texture5].map((texture, index) => (
                      <div
                      key={index} 
                      className="configpanel__texture" 
                      >
                        {texture && <img className='configpanel__texture__image' src={URL.createObjectURL(texture!.content)} alt={`texture ${index}`}/>}
                        <p className='configpanel__texture__side'>{MapRender.translateTextureSide(index)}</p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
        </div>
        
    );
};

export default ConfigPanel;