import homePageScreen from "../HomePage/HomePage.js";
import axios from "axios";
import fs from "fs";
import { cleanupKeyListener, keyPress } from "../index.js";
import { url } from "../index.js";
import { input } from "@inquirer/prompts";
import loginScreenError from "./LoginError.js";
async function loginScreen() {
  try {
    console.clear();
    console.log("Please enter your account details.");
    console.log("");

    const username = await input({ message: "Username: ", required: true });
    const password = await input({ message: "Password: ", required: true });

    const body = {
      username,
      password,
    };
    const response = (await axios.post(`${url}/auth/login`, body)).data;
    console.log(response);
    console.log("");
    const token = JSON.stringify({
      jwt_token: response.jwt_token,
    });

    fs.writeFileSync("config.json", token);
    console.log("Authenticating with the server...");
    console.log("Login Successful");
    console.log("\n(Press 'enter' to continue.)");
    keyPress(function (ch, key) {
      if (key && key.name == "return") {
        cleanupKeyListener();
        homePageScreen();
      }
    });
  } catch (err) {
    if (err.status) {
      if (err.status === 404) {
        loginScreenError("User not found.");
      } else if (err.status === 401) {
        loginScreenError("Invalid credentials.");
      } else if (err.status === 500) {
        loginScreenError("Internal server error occured.");
      }
    } else {
      loginScreenError("An unexpected error occurred. Please try again later.");
    }
  }
}

export default loginScreen;
