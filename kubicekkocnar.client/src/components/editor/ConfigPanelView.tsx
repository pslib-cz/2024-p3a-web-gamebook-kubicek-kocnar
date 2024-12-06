import { Tool } from "./ToolBar";
import { useContext } from "react";
import { AppContext } from "../AppContextProvider";
import MapRender from '../../lib/MapRenderer';
import MapRenderer from '../../lib/MapRenderer';
import Level from "../../lib/Level";
import { MaterialSymbol, SymbolCodepoints } from 'react-material-symbols';
import GenericFeature, { FeatureType, FeatureTypeIcon } from "../../types/Feature";
import { applyOperation } from 'fast-json-patch'; 
import InputSlider from "../InputSlider";
import { debounce } from 'lodash';

interface ConfigPanelProps {
    level: Level;
    setOpenAddModal: (open: boolean) => void;
}

const ConfigPanelView: React.FC<ConfigPanelProps> = ({level, setOpenAddModal}) => {
    const { toolState, blockState, featureState, setFeature, setTool } = useContext(AppContext);

    const selectFeature = (feature: GenericFeature) => {
        setFeature(feature);
        setTool(Tool.FeatureView);
    }

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
                    <h3>
                        Level {level.name} ({level.gameId}/{level.levelId})
                    </h3>
                    <h4>Features:</h4>
                        <button className='configpanel__addbtn'  onClick={() => setOpenAddModal(true)}><MaterialSymbol icon='add'/></button>
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
                        <h3>
                            <MaterialSymbol icon={FeatureTypeIcon[featureState.type] as SymbolCodepoints}/> {FeatureType[featureState.type]} {featureState.featureId}
                        </h3> 
                        <button className='configpanel__deletebtn' 
                            onClick={async () => {await level.removeFeature(featureState); setTool(Tool.List)}}>
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


        //!---------------------------------- BLOCK MOUSE TOOL ---------------------------------- */

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
        
        //!---------------------------------- ADD TOOL ---------------------------------- */
        
        case Tool.Add:
            return (
                <h3>
                    Add block
                </h3>
            );
        default: <></>
    }

}

export default ConfigPanelView;