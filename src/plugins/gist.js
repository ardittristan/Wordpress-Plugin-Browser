import axios from "axios";
import store from "./store";

class Gist {
  constructor() {
    store.defaults({ githubKey: "", gistId: "" });
    /** @type {String} */
    this.githubKey = store.get("githubKey");
    /** @type {String} */
    this.gistId = store.get("gistId");
    this.initialized = false;
  }

  async init() {
    this.githubKey = store.get("githubKey");
    this.gistId = store.get("gistId");
    if (!(this.githubKey.length > 0) || !(this.gistId.length > 0)) return false;

    this.initialized = true;
    return true;
  }

  async upload() {
    if (!this.initialized && !(await this.init())) {
      if (!(this.githubKey.length > 0)) return "keyMissing";
      if (!(this.gistId.length > 0)) return "idMissing";
      return;
    }

    axios.patch(
      "https://api.github.com/gists/" + this.gistId,
      {
        files: {
          "settings.json": {
            content: JSON.stringify(store.get("WPFavorites")),
          },
        },
      },
      {
        headers: { Authorization: "token " + this.githubKey },
      }
    );
  }

  async download() {
    if (!this.initialized && !(await this.init())) {
      if (!(this.githubKey.length > 0)) return "keyMissing";
      if (!(this.gistId.length > 0)) return "idMissing";
      return;
    }
    const res = await axios.get("https://api.github.com/gists/" + this.gistId, { headers: { Authorization: "token " + this.githubKey } });
    const content = res.data?.files?.["settings.json"]?.content;
    if (content) store.set("WPFavorites", JSON.parse(content));
  }

  async create() {
    const res = await axios.post(
      "https://api.github.com/gists",
      {
        public: false,
        files: {
          "settings.json": {
            content: JSON.stringify(store.get("WPFavorites")),
          },
        },
      },
      {
        headers: { Authorization: "token " + this.githubKey },
      }
    );
    const id = res.data.id;
    store.set("gistId", id);
    return id;
  }
}

export default new Gist();
