import fs from "fs";

async function logout() {
  try {
    fs.writeFileSync("config.json", JSON.stringify({}));
  } catch (err) {
    console.log("failed to log out", err);
  }
}

export default logout;
