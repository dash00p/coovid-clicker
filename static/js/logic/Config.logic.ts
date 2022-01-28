import prodConfig from "../collection/Config.prod.collection.json";
import devConfig from "../collection/Config.dev.collection.json";

export default IS_DEV ? devConfig : prodConfig;
