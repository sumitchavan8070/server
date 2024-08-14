const appUpdate = (req, res) => {
  const { app_name, app_type } = req.body;

  const isAndroid = app_type === "Android";
  const appName = app_name;

  let appId = isAndroid ? "com.sc.meadhikari" : "1094249594";
  //   console.log(appName + "appname ");

  const updateReletedData = (appName) => {
    switch (appName) {
      case "meadhikari":
        return {
          softUpdate: 0,
          forceUpdate: 1,
          buildNo: 50011,
          iosBuildNo: 102,
          version: "6.1.8",
          playIcon: "",
          downloadUrl:
            "https://play.google.com/store/apps/details?id=com.globalassignmenthelp&hl=en",
        };

      default:
        throw new Error("Unknown package name: " + appName);
    }
  };

  const versionData = updateReletedData(appName);

  const response = {
    appId,
    softUpdate: versionData.softUpdate,
    forceUpdate: versionData.forceUpdate,
    buildNo: versionData.buildNo,
    iosBuildNo: versionData.iosBuildNo,
    version: versionData.version,
    title: "Update Available",
    message:
      "A new version of the app is available. Please update to the latest version.",
    downloadUrl: versionData.downloadUrl,
    playIcon: versionData.playIcon,
  };

  res.json(response);
};

module.exports = {
  appUpdate,
};
