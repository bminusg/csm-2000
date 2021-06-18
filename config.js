const env = process.env.NODE_ENV || "dev";
const config = {
  dev: {
    paths: {
      campaigns: __dirname + "/campaigns",
      projects: __dirname + "/projects",
      upload: __dirname + "/upload",
    },
  },
};

module.exports = config[env];
