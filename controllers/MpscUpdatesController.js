const axios = require("axios");
const cheerio = require("cheerio");

const fetchImportantUpdates = async (req, res) => {
  try {
    // const response = await axios.get(
    //   "https://mpsc.gov.in/adv_notification?m=8"
    // );
    const response = await axios.get("https://mpsc.gov.in");
    const $ = cheerio.load(response.data);

    const importantUpdates = [];
    const xpathExpression = "div.alert.alert-secondary a";
    // const xpathExpression = "#datatable > tbody > tr";

    $(xpathExpression).each((index, element) => {
      let title = $(element).text().trim();
      // title = title.replace(/\s+/g, " "); // Replace multiple whitespaces with a single space
      const href = $(element).attr("href"); // Extract the href attribute
      // console.log("Mpsc" + title);
      //  console.log("href" + href);
      importantUpdates.push({ title, href });
    });

    res.json({ updates: importantUpdates });
  } catch (error) {
    console.error("Error fetching important updates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  fetchImportantUpdates,
};
