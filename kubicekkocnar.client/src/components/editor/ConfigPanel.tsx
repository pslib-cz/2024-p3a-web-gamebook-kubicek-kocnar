import React, { useContext, useState, useEffect } from 'react';
import '../../styles/ConfigPanel.css';
import { MaterialSymbol, SymbolCodepoints } from 'react-material-symbols';
import { AppContext } from '../AppContextProvider';
import MapRender from '../../lib/MapRenderer';
import MapRenderer from '../../lib/MapRenderer';
import { Tool } from './ToolBar';
import Level from '../../lib/Level';
import GenericFeature, { FeatureType, FeatureTypeIcon } from '../../types/Feature';

interface ConfigPanelProps {
    level: Level;
}

const ConfigPanel: React.FC<ConfigPanelProps> = (level) => {

    const [ modalFeature, setModalFeature ] = useState<GenericFeature | null>(null);

    const { toolState, blockState, setTool, setFeature, featureState } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(true);

    const [openAddModal, setOpenAddModal] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // This effect will run whenever blockState changes
        console.log("Selected block changed:", blockState);
    }, [blockState]);

    const selectFeature = (feature: GenericFeature) => {
        setFeature(feature);
        setTool(Tool.FeatureView);
    }

    const setConfigPanelView = () => {
        switch (toolState) {
            case Tool.List:
                return (
                    <>
                        <h3>
                            Level {level.level.name} ({level.level.gameId}/{level.level.levelId})
                        </h3>
                        <h4>Features:</h4>
                            <button className='configpanel__addbtn'  onClick={() => setOpenAddModal(true)}><MaterialSymbol icon='add'/></button>
                        <ul className='configpanel__list'>
                            {level.level.features.map((feature, index) => (
                                feature && <li key={index} className='configpanel__list__item' onClick={() => selectFeature(feature)}>
                                    <MaterialSymbol icon={FeatureTypeIcon[feature.type] as SymbolCodepoints}/> {FeatureType[feature.type]} {feature.featureId} 
                                    &nbsp;(<span className='coord--x'>{feature.position?.x}</span>, <span className='coord--y'>{feature.position?.y}</span>, <span className='coord--z'>{feature.position?.z}</span>)
                                </li>
                            ))}
                        </ul>
                        
                    </>
                );
            case Tool.FeatureView:
                return featureState && (
                    <>
                        <h3 className='flexrow'>
                            <MaterialSymbol icon={FeatureTypeIcon[featureState.type] as SymbolCodepoints}/> {FeatureType[featureState.type]} {featureState?.featureId}
                            <button className='configpanel__deletebtn' onClick={() => level.level.removeFeature(featureState!)}><MaterialSymbol icon='delete'/></button>
                        </h3> 
                        <div className="configpanel__inputs">
                            <div className="configpanel__input">
                                <label htmlFor="featurepositionx">X: </label>
                                <input type="text" id="featurepositionx" value={featureState?.position?.x} readOnly/>
                            </div>
                            <div className="configpanel__input">
                                <label htmlFor="featurepositiony">Y: </label>
                                <input type="text" id="featurepositiony" value={featureState?.position?.y} readOnly/>
                            </div>
                            <div className="configpanel__input">
                                <label htmlFor="featurepositionz">Z: </label>
                                <input type="text" id="featurepositionz" value={featureState?.position?.z} readOnly/>
                            </div>
                        </div>
                        <div className="configpanel__inputs">
                            {Object.keys(featureState?.params ?? {}).map((key, index) => (
                                <div key={index} className="configpanel__input">
                                    <label htmlFor={key}>{key}</label>
                                    <input type="text" id={key} value={featureState?.params[key]} readOnly/>
                                </div>
                            ))}
                        </div>
                        <p>
                            Position: <span className='coord--x'>{featureState?.position?.x}</span>, <span className='coord--y'>{featureState?.position?.y}</span>, <span className='coord--z'>{featureState?.position?.z}</span>
                        </p>
                        <p>
                            Added at: {new Date(featureState?.created ?? 0).toLocaleString()}
                        </p>
                    </>
                )

            case Tool.Mouse:
                return (
                    <>
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
                    </>
                );
            case Tool.Add:
                return (
                    <h3>
                        Add block
                    </h3>
                );
            default: <></>
        }

    }

    return (
        <>
        <div className={`configpanel ${isOpen ? 'configpanel--open' : 'configpanel--closed'}`}>
            <button className="toggle-button" onClick={togglePanel}>
                {isOpen ? <MaterialSymbol icon='chevron_right' size={24}/> : <MaterialSymbol icon='chevron_left' size={24}/>}
            </button>
            <div className='configpanel__info'>
            {setConfigPanelView()}
            </div>
        </div>
        {openAddModal && <div className='modal configpanel__addmodal'>
            
            {modalFeature ?
            <>
            <h2><MaterialSymbol icon={FeatureTypeIcon[modalFeature.type] as SymbolCodepoints}/> Add {FeatureType[modalFeature.type]} </h2>
            <div className="configpanel__addmodal__addparams">
                <h4>Parameters</h4>
                {Object.keys(modalFeature.params).map((key, index) => (
                    <div key={index} className="configpanel__input">
                        <label htmlFor={key}>{key}</label>
                        <input type="text" id={key} value={modalFeature.params[key]} readOnly/>
                    </div>
                ))}
                <div className="configpanel__input">
                    <label htmlFor="featurepositionx">X: </label>
                    <input type="text" id="featurepositionx" value={featureState?.position?.x} readOnly/>
                </div>
                <div className="configpanel__input">
                    <label htmlFor="featurepositiony">Y: </label>
                    <input type="text" id="featurepositiony" value={featureState?.position?.y} readOnly/>
                </div>
                <div className="configpanel__input">
                    <label htmlFor="featurepositionz">Z: </label>
                    <input type="text" id="featurepositionz" value={featureState?.position?.z} readOnly/>
                </div>



                <button className="configpanel__addmodal__addbtn" onClick={() => {
                    level.level.addFeature(modalFeature);
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
                    params: {}
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