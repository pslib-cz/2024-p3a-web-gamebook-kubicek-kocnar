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
  "Light" = 1,
  "Chest" = 2,
  "Portal" = 3,
  "Crystal" = 4,
  "Paper" = 5,
}
enum FeatureTypeIcon {
  "light_mode" = 1,
  "orders" = 2,
  "call_split" = 3,
  "diamond" = 4,
}

// the FeatureParams type is used to define the properties of a feature -> its content depends on the FeatureType
// its just a dictionary which can be extended

interface FeatureParams {
  [key: string]: unknown;
}


export default GenericFeature;
export { FeatureType, FeatureTypeIcon }
export type { FeatureParams };