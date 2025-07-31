import { input } from "@inquirer/prompts";
import signUpErrorScreenB from "./SignupError.js";
import { url } from "../index.js";
import homePageScreen from "../HomePage/HomePage.js";
import fs from "fs";
import axios from "axios";
async function signUpScreen() {
  try {
    console.clear();
    const email = await input({ message: "Email : ", required: true });
    const username = await input({ message: "username: ", required: true });
    const password = await input({ message: "password: ", required: true });
    const leetcodeId = await input({
      message: "leetcodeId: ",
      required: false,
    });

    let leetcodeSessionToken = ''; 
    
    if(leetcodeId != '') {
      leetcodeSessionToken = await input({
      message: "leetcode-session-token: ",
      required: false,
      });
    }
    
    const codeforcesId = await input({
      message: "codeforces-ID: ",
      required: false,
    });
    const gfgId = await input({ message: "GFG-ID: ", required: false });
    let gfgToken = '';

    if(gfgId != '') {
      gfgToken = await input({ message: "GFG Token : ", required: false });
    }

    console.log("");
    console.log("Creating your account...");

    const body = {
      username,
      password,
      leetcodeSessionToken,
      leetcodeId,
      codeforcesId,
      gfgId,
      email,
      gfgToken,
    };
    console.log(body);

    const response = (await axios.post(`${url}/auth/signup`, body)).data;

    const token = JSON.stringify({
      jwt_token: response.jwt_token,
    });

    fs.writeFileSync("config.json", token);
    console.log("Account created successfully!");

    homePageScreen();
  } catch (err) {
    if (err.status) {
      if (err.status === 402) {
        signUpErrorScreenB("User already exists");
      } else if (err.status === 500) {
        signUpErrorScreenB("Internal server error");
      }
    } else {
      signUpErrorScreenB(
        "An unexpected error occurred. Please try again later."
      );
    }
  }
}

export default signUpScreen;
