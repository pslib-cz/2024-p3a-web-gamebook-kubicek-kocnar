import { Tool } from "./ToolBar";
import { useContext, useState } from "react";
import { AppContext } from "../AppContextProvider";
import MapRender from '../../lib/MapRenderer';
import MapRenderer from '../../lib/MapRenderer';
import Level from "../../lib/Level";
import { MaterialSymbol, SymbolCodepoints } from 'react-material-symbols';
import GenericFeature, { FeatureType, FeatureTypeIcon } from "../../types/Feature";
import { applyOperation } from 'fast-json-patch'; 
import InputSlider from "../InputSlider";
import { debounce } from 'lodash';
import Block from "../../types/Block";

interface ConfigPanelProps {
    level: Level;
    setOpenAddFeatureModal: (open: boolean) => void;
}

const ConfigPanelView: React.FC<ConfigPanelProps> = ({level, setOpenAddFeatureModal}) => {
    const { toolState, blockState, featureState, setFeature, setToolState, setAddBlockParams, addBlockParamsState } = useContext(AppContext);

    const selectFeature = (feature: GenericFeature) => {
        setFeature(feature);
        setToolState(Tool.FeatureView);
    }

    const [block, setBlock] = useState<Block | null>(null);

    const debouncedPatchFeature = debounce((featureId: number, path: string, value: unknown) => {
        level.patchFeature(featureId, path, value);
    }, 100);

    const patchFeature = (path: string, value: unknown) => {
        if (!featureState) return;
        debouncedPatchFeature(featureState!.featureId, path, value);
        const newFeature = applyOperation(featureState, {op: 'replace', path, value}).newDocument;
        console.log("newFeature", newFeature);
        setFeature(newFeature);
    }

    switch (toolState) {


        //!---------------------------------- LIST TOOL ---------------------------------- */

        case Tool.List:
            return (
                <>
                    <h2>
                        Level {level.name} ({level.gameId}/{level.levelId})
                    </h2>
                    <h4>Features:</h4>
                        <button className='configpanel__addbtn'  onClick={() => setOpenAddFeatureModal(true)}><MaterialSymbol icon='add'/></button>
                    <ul className='configpanel__list'>
                        {level.featureRenderer.features.map((feature, index) => (
                            feature && <li key={index} className='configpanel__list__item' onClick={() => selectFeature(feature)}>
                                <MaterialSymbol icon={FeatureTypeIcon[feature.type] as SymbolCodepoints}/> {FeatureType[feature.type]} {feature.featureId} 
                                &nbsp;(<span className='coord--x'>{feature.position?.x}</span>, <span className='coord--y'>{feature.position?.y}</span>, <span className='coord--z'>{feature.position?.z}</span>)
                            </li>
                        ))}
                    </ul>
                    
                </>
            );


        //!---------------------------------- FEATURE VIEW TOOL (Hidden) ---------------------------------- */

        case Tool.FeatureView:
            return featureState && (
                <>
                    <div className="flexrow">
                        <h2>
                            <MaterialSymbol icon={FeatureTypeIcon[featureState.type] as SymbolCodepoints}/> {FeatureType[featureState.type]} {featureState.featureId}
                        </h2> 
                        <button className='configpanel__deletebtn' 
                            onClick={async () => {await level.removeFeature(featureState); setToolState(Tool.List)}}>
                        <MaterialSymbol icon='delete'/></button>
                        <button className='configpanel__copybtn' 
                            onClick={async () => {const newFeature = await level.addFeature({...featureState, featureId: 0}); if (newFeature) setFeature(newFeature)}}>
                        <MaterialSymbol icon='perm_media'/></button>
                    </div>
                    <div className="configpanel__inputs">
                        <h3>Properties</h3>
                        <div className="configpanel__input">
                            <label htmlFor="featurepositionx"><span className='coord--x'>X</span>: </label>
                            <InputSlider defaultValue={featureState.position?.x} 
                            onChange={(value) => patchFeature("/x", value)}
                            />
                        </div>
                        <div className="configpanel__input">
                            <label htmlFor="featurepositiony"><span className='coord--y'>Y</span>: </label>
                            <InputSlider defaultValue={featureState.position?.y}
                            onChange={(value) => patchFeature("/y", value)}
                            />
                        </div>
                        <div className="configpanel__input">
                            <label htmlFor="featurepositionz"><span className='coord--z'>Z</span>: </label>
                            <InputSlider defaultValue={featureState.position?.z}
                            onChange={(value) => patchFeature("/z", value)}
                            />
                        </div>
                    </div>
                    <h3>{FeatureType[featureState.type]} properties</h3>
                    <div className="configpanel__inputs">
                        {Object.keys(featureState.params ?? {}).map((key, index) => (
                            <div key={index} className="configpanel__input">
                                <label htmlFor={key}>{key}</label>
                                <input 
                                type={key == "color" ? "color" : featureState.params[key] == "true" || featureState.params[key] == "false" ? "checkbox" : !isNaN(parseFloat(featureState.params[key])) ? "number" : "text"}
                                 id={key} defaultValue={featureState.params[key]}
                                onChange={(e) => patchFeature(`/Params/${key}`, e.currentTarget.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <p>
                        Added at: {new Date(featureState.created ?? 0).toLocaleString()}
                    </p>
                </>
            )

        //!--------------------------------- BLOCK LIST TOOL --------------------------------- */
        case Tool.BlockList:
            return (
                <>
                <h2>
                    Block List
                </h2>
                <button className='configpanel__addbtn'  onClick={() => setOpenAddFeatureModal(true)}><MaterialSymbol icon='add'/></button>
                {level.mapRenderer.blocksReference.blocks.map((block, index) => (
                    <div key={index} className='configpanel__blockeditor' onClick={() => {setBlock(block); setToolState(Tool.BlockEditor)}}>
                        <img className='configpanel__texture__image_sm' src={block.texture0 ? URL.createObjectURL(MapRenderer.loadTexture(block.texture0)) : '/missing.png'} alt={`texture ${index}`}/>
                        <h3>{block.name}</h3>
                        <p>Attributes: {block.attributes}</p>
                    </div>
                ))}
                </>
            )

        //!---------------------------------- BLOCK EDITOR TOOL ---------------------------------- */
        case Tool.BlockEditor:
            return (
                <>
                    <h2>
                        Block Editor
                    </h2>
                    <div className="configpanel__blockeditor">
                        <img className='configpanel__texture__image' src={block?.texture0 ? URL.createObjectURL(MapRenderer.loadTexture(block.texture0)) : '/missing.png'} alt={`texture 0`}/>
                        <h3>{block?.name}</h3>
                    </div>
                    <h3>Textures</h3>
                    <div className="configpanel__textures">
                        {[block?.texture0, block?.texture1, block?.texture2, block?.texture3, block?.texture4, block?.texture5].map((texture, index) => (
                            <div key={index} className="configpanel__texture">
                                <img className='configpanel__texture__image' src={texture ? URL.createObjectURL(MapRenderer.loadTexture(texture)) : '/missing.png'} alt={`texture ${index}`}/>
                                <p className='configpanel__texture__side'>{MapRender.translateTextureSide(index)}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Attributes</h3>
                    <div className="configpanel__attributes">
                        {block?.attributes.map((attribute, index) => (
                            <div key={index} className="configpanel__attribute">
                                <label htmlFor={attribute}>{attribute}</label>
                                <input type="text" id={attribute} defaultValue={block?.attributes[index]}
                                onChange={(e) => {block.attributes[index] = e.currentTarget.value; setBlock({...block})}}
                                />
                            </div>
                        ))}
                    </div>
                    {/* <button className='configpanel__deletebtn' onClick={() => {level.removeBlock(blockState); setTool(Tool.List)}}><MaterialSymbol icon='delete'/></button> */}
                </>
            );



        //!---------------------------------- BLOCK MOUSE TOOL ---------------------------------- */

        case Tool.Mouse:
            return (
                <>
                    <h2>
                        {blockState?.block.name} {blockState?.placedBlockId}
                    </h2>
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
        
        //!---------------------------------- ADD TOOL ---------------------------------- */
        
        case Tool.Add:
            return (
                <>
                    <h2>
                        Add block
                    </h2>
                    <div className="configpanel__addblocks">
                        <button className={`configpanel__addblock${addBlockParamsState?.blockId ? '':' configpanel__addblock--selected'}`} onClick={() => setAddBlockParams({...addBlockParamsState, blockId: undefined})}>
                            <MaterialSymbol icon="copy_all" size={48}/>
                            <h3>Copy</h3>
                        </button>
                        {level.mapRenderer.blocksReference.blocks.map((block, index) => (
                            <button key={index} className={`configpanel__addblock${addBlockParamsState?.blockId==block.blockId?' configpanel__addblock--selected':''}`} onClick={() => setAddBlockParams({...addBlockParamsState, blockId: block.blockId})}>
                                <img className='configpanel__texture__image_sm' src={block.texture0 ? URL.createObjectURL(MapRenderer.loadTexture(block.texture0)) : '/missing.png'} alt={`texture ${index}`}/>
                                <h3>{block.name}</h3>
                            </button>
                        ))}
                    </div>
                    <h3>Default state:
                        <input type="checkbox" className="configpanel__checkbox" onChange={(e) => {setAddBlockParams({...addBlockParamsState, state: e.currentTarget.checked?'':undefined})}}/>
                    </h3>
                    <input type="text" className={`configpanel__fullinput${addBlockParamsState?.state===undefined?' hidden':''}`} onChange={(e) => setAddBlockParams({...addBlockParamsState, state: e.currentTarget.value})}/>
                </>
            );
        default: <></>
    }

}

export default ConfigPanelView;