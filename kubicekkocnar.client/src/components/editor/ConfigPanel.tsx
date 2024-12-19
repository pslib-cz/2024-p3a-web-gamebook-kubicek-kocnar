import React, { useContext, useEffect, useState } from 'react';
import '../../styles/ConfigPanel.css';
import { MaterialSymbol, SymbolCodepoints } from 'react-material-symbols';
import Level from "../../lib/Level";
import GenericFeature, { FeatureType, FeatureTypeIcon } from '../../types/Feature';
import ConfigPanelView from './ConfigPanelView';
import { Vector3 } from 'three';
import { AppContext } from '../AppContextProvider';
import { Tool } from './ToolBar';
import InputSlider from '../InputSlider';

interface ConfigPanelProps {
    level: Level;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ level }) => {

    const [ modalFeature, setModalFeature ] = useState<GenericFeature | null>(null);

    const { toolState } = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(true);

    const [openAddModal, setOpenAddModal] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const setDefaultFeatureParams = (type: FeatureType) => {
        switch (type) {
            case FeatureType.Light:
                return {intensity: '1', color: '#ffffff'};
            case FeatureType.Crystal:
                return {};
            case FeatureType.Portal:
                return { source: level.levelId, destination: '2', color: '#ffffff', facing: 'X', width: '2', height: '3' };
        }
    }

    useEffect(() => {
        if (toolState === Tool.PlayerCamera) setIsOpen(false);
        else setIsOpen(true);
    }, [toolState]);

    return (
        <>
        <div className={`configpanel ${isOpen ? 'configpanel--open' : 'configpanel--closed'}`}>
            <button className="toggle-button" onClick={togglePanel}>
                {isOpen ? <MaterialSymbol icon='chevron_right' size={24}/> : <MaterialSymbol icon='chevron_left' size={24}/>}
            </button>
            <div className='configpanel__info'>
                <ConfigPanelView level={level} setOpenAddModal={setOpenAddModal}/>
            </div>
        </div>


        {openAddModal && <div className='modal configpanel__addmodal'>
            
            {modalFeature ?
            <>
            <h2><MaterialSymbol icon={FeatureTypeIcon[modalFeature.type] as SymbolCodepoints}/> Add {FeatureType[modalFeature.type]} </h2>
            <div className="configpanel__addmodal__addparams">
                <h3>Properties</h3>
                <div className="configpanel__input">
                    <label htmlFor="featurepositionx"><span className='coord--x'>X</span>: </label>
                    <InputSlider
                        defaultValue={modalFeature.position?.x}
                        onChange={(value) => setModalFeature({...modalFeature, position: new Vector3(value, modalFeature.position?.y, modalFeature.position?.z)})}
                    />
                </div>
                <div className="configpanel__input">
                    <label htmlFor="featurepositiony"><span className='coord--y'>Y</span>: </label>
                    <InputSlider
                        defaultValue={modalFeature.position?.y}
                        onChange={(value) => setModalFeature({...modalFeature, position: new Vector3(modalFeature.position?.x, value, modalFeature.position?.z)})}
                    />
                </div>
                <div className="configpanel__input">
                    <label htmlFor="featurepositionz"><span className='coord--z'>Z</span>: </label>
                    <InputSlider
                        defaultValue={modalFeature.position?.z}
                        onChange={(value) => setModalFeature({...modalFeature, position: new Vector3(modalFeature.position?.x, modalFeature.position?.y, value)})}
                    />
                </div>
                <h3>{FeatureType[modalFeature.type]} Properties</h3>
                {Object.keys(modalFeature.params).map((key, index) => (
                    <div key={index} className="configpanel__input">
                        <label htmlFor={key}>{key}: </label>
                        <input type="text" id={key} defaultValue={modalFeature.params[key]}
                        onChange={(e) => setModalFeature({...modalFeature, params: {...modalFeature.params, [key]: e.currentTarget.value}})
                        }
                        />
                    </div>
                ))}



                <button className="configpanel__addmodal__addbtn" onClick={() => {
                    level.addFeature(modalFeature);
                    setOpenAddModal(false);
                }}>Add</button>
            </div>
            </>
            :
            <>
            <h2>Add feature</h2>
            <div className="configpanel__addmodal__addoptions">
            {//@ts-expect-error FeatureType for some reason also contains the index as a string, so we need to filter it out}
            (Object.values(FeatureType) as Array<keyof typeof FeatureType>).map((featureType, index, features) => (parseInt(featureType) != featureType) && 
                <button className="configpanel__addmodal__addoption" onClick={() => setModalFeature({
                    featureId: 0,
                    type: FeatureType[featureType],
                    params: setDefaultFeatureParams(FeatureType[featureType]),
                    position: new Vector3(0, 0, 0),
                } as GenericFeature)}>
                {//@ts-expect-error FeatureTypeIcon for some reason also contains the index as a string, so we need to filter it out
                <MaterialSymbol icon={FeatureTypeIcon[features[features.length/2+index]] as SymbolCodepoints} size={32}/>}
                {featureType}
                </button>
            )}
            </div>
            </>
            }
        </div>}
        </>
    );
};

export default ConfigPanel;