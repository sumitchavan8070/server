const AppUpdate = require("../models/AppUpdate");

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

// 07 sep 2024
//below code updating above code was working

// Get all app updates
const getAppUpdates = async (req, res) => {
  try {
    const updates = await AppUpdate.find().sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch updates", error: err.message });
  }
};

// Create a new app update
const createAppUpdate = async (req, res) => {
  const {
    appName,
    buildNo,
    iosBuildNo,
    version,
    softUpdate,
    forceUpdate,
    playIcon,
    downloadUrl,
  } = req.body;

  const newUpdate = new AppUpdate({
    appName,
    buildNo,
    iosBuildNo,
    version,
    softUpdate,
    forceUpdate,
    playIcon,
    downloadUrl,
  });

  try {
    const savedUpdate = await newUpdate.save();
    res.status(201).json(savedUpdate);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create update", error: err.message });
  }
};

// Update an existing app update
const updateAppUpdate = async (req, res) => {
  const { id } = req.params;
  const {
    appName,
    buildNo,
    iosBuildNo,
    version,
    softUpdate,
    forceUpdate,
    playIcon,
    downloadUrl,
  } = req.body;

  try {
    const update = await AppUpdate.findById(id);

    if (!update) {
      return res.status(404).json({ message: "App update not found" });
    }

    update.appName = appName || update.appName;
    update.buildNo = buildNo || update.buildNo;
    update.iosBuildNo = iosBuildNo || update.iosBuildNo;
    update.version = version || update.version;
    update.softUpdate = softUpdate ?? update.softUpdate;
    update.forceUpdate = forceUpdate ?? update.forceUpdate;
    update.playIcon = playIcon || update.playIcon;
    update.downloadUrl = downloadUrl || update.downloadUrl;

    const updatedUpdate = await update.save();
    res.status(200).json(updatedUpdate);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update app update", error: err.message });
  }
};

// Delete an app update
const deleteAppUpdate = async (req, res) => {
  const { id } = req.params;

  try {
    const update = await AppUpdate.findById(id);

    if (!update) {
      return res.status(404).json({ message: "App update not found" });
    }

    await update.remove();
    res.status(200).json({ message: "App update deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete app update", error: err.message });
  }
};

module.exports = {
  appUpdate,
  getAppUpdates,
  createAppUpdate,
  updateAppUpdate,
  deleteAppUpdate,
};
