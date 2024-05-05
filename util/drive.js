const axios = require("axios");

const CLIENT_ID =
  "6698747106-n6a9covdetreoi7haspf77v874jv77fn.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

const tokenEndpoint = "https://oauth2.googleapis.com/token";

async function getTokens() {
  try {
    const response = await axios.post(tokenEndpoint, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token } = response.data;
    console.log("Access Token:", access_token);
    console.log("Refresh Token:", refresh_token);
  } catch (error) {
    console.error("Error getting tokens:", error.message);
  }
}

getTokens();
