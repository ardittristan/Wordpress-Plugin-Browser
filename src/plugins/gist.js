import fetch from "unfetch";
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

    fetch("https://api.github.com/gists/" + this.gistId, {
      method: "PATCH",
      body: JSON.stringify({
        files: {
          "settings.json": {
            content: JSON.stringify([store.get("WPFavorites"), store.get("WPMeh")]),
          },
        },
      }),
      headers: { Authorization: "token " + this.githubKey },
    });
  }

  async download(checkOverwrite = false) {
    if (!this.initialized && !(await this.init())) {
      if (!(this.githubKey.length > 0)) return "keyMissing";
      if (!(this.gistId.length > 0)) return "idMissing";
      return;
    }
    const res = await fetch("https://api.github.com/gists/" + this.gistId, { headers: { Authorization: "token " + this.githubKey } });
    const content = JSON.parse((await res.json())?.files?.["settings.json"]?.content);
    if (checkOverwrite && JSON.stringify(content) !== JSON.stringify([store.get("WPFavorites"), store.get("WPMeh")])) return "overwrite";
    if (content) {
      if (typeof content[0] === "string") store.set("WPFavorites", content);
      else {
        store.set("WPFavorites", content[0]);
        store.set("WPMeh", content[1]);
      }
    }
  }

  async create() {
    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      body: JSON.stringify({
        public: false,
        files: {
          "settings.json": {
            content: JSON.stringify([store.get("WPFavorites"), store.get("WPMeh")]),
          },
        },
      }),
      headers: { Authorization: "token " + this.githubKey },
    });
    const id = (await res.json()).id;
    store.set("gistId", id);
    return id;
  }
}

export default new Gist();
