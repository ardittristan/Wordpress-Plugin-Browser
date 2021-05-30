import engine from "store/src/store-engine";
import localStorage from "store/storages/localStorage";
import defaults from "store/plugins/defaults";

const storages = [localStorage];
const plugins = [defaults];

const store = engine.createStore(storages, plugins);

export default store;
