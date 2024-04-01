import prodConfig from "../config/prod.json";
import devConfig from "../config/dev.json";

export default IS_DEV ? devConfig : prodConfig;
