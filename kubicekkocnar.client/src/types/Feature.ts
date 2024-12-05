import { Vector3, Object3D } from "three";


// a Feature is a thing in a level that can be interacted with
// it can be a lot of things, like a light or a turret, which all have different properties

// since the Features are interactive, or the need to be rendered in a special way, the are handled by their own classes and rendereds...

interface GenericFeature {
    featureId: number;
    type: FeatureType; // what kind of feature is it -> determines the properties, models and behavior
    position?: Vector3; // where is it placed, needs conversion from [server] ...{x,y,z} to [client] Vector3
    params: FeatureParams;
    created: Date;
    object: Object3D;
}

enum FeatureType {
    "Light"=1,
    "Crystal"=2
}
enum FeatureTypeIcon {
    "lightbulb"=1,
    "diamond"=2
}

// the FeatureParams type is used to define the properties of a feature -> its content depends on the FeatureType
// its just a dictionary which can be extended

interface FeatureParams {
    [key: string]: string;
}


export default GenericFeature;
export { FeatureType, FeatureTypeIcon }
export type { FeatureParams };