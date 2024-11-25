import React, { useContext, useState, useEffect } from 'react';
import '../../styles/ConfigPanel.css';
import { MaterialSymbol } from 'react-material-symbols';
import { AppContext } from '../AppContextProvider';

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
                  {blockState.mesh?.geometry.type} {blockState.blockId}
              </h3>
              <p>
                  Name: {blockState.mesh?.name}
              </p>
              <p>
                  Position: {blockState.position[0]}, {blockState.position[1]}, {blockState.position[2]}
              </p>
              <div>
                  <h4>Textures</h4>
                  <div className="textures">
                    {blockState.texture?.sides?.map((side, index) => (
                      <div
                      key={index} 
                      className="texture" 
                      >
                        <p>Side: {index}</p>
                        <img src={side.url} alt={`texture ${index}`}/>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
        </div>
    );
};

export default ConfigPanel;