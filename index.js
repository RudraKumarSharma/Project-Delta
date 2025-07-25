#!usr/bin/env node
import inquirer from "inquirer";
import axios from "axios";
import fs from "fs";
import keypress from "keypress";
import { select, Separator, input, password } from "@inquirer/prompts";
import Table from "cli-table3";
import cliSpinners from "cli-spinners";
import { createSpinner } from "nanospinner";
function exit() {
  console.clear();
}

function timestampToDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
	return formatted;
}

const url = "http://localhost:3000";
async function checkLoginSession() {
  if (fs.readFileSync("config.json").length != 0) {
    let token = JSON.parse(fs.readFileSync("config.json"));

    axios(`${url}/auth/check-auth`, {
      headers: {
        Authorization: `Bearer ${token.jwt_token}`,
      },
    })
      .then(async () => {
        await homePageScreen();
      })
      .catch(async () => await parentScreen());
  } else {
    await parentScreen();
  }
}

checkLoginSession();

async function parentScreen() {
  try {
    console.clear();
    console.log("┌──────────────────────────────────────────┐");
    console.log("│                                          │");
    console.log("│            Welcome to #track             │");
    console.log("│                                          │");
    console.log("└──────────────────────────────────────────┘");

    const answer = await select({
      message: "Please log in to view your progress.",
      choices: [
        {
          name: "login",
          value: async () => loginScreen(), // we will call login function
          description: "Select to Login",
        },
        {
          name: "Sign up",
          value: async () => signUpScreen(), // signup function call
          description: "Select to signup for new users",
        },
        {
          name: "Exit",
          value: async () => exit(),
          description: "Select to Exit",
        },
      ],
    });

    await answer();
  } catch (err) {
    console.log("an error occured in parent function : ", err);
  }
}

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

    keypress(process.stdin);
    process.stdin.on("keypress", function (ch, key) {
      if (key && key.name == "return") {
        homePageScreen();
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
  } catch (err) {
    loginScreenError(err);
  }
}

async function loginScreenError(err) {
  console.clear();
  try {
    const answer = await select({
      message: `${err}`,
      choices: [
        {
          name: "Try Again",
          value: async () => await loginScreen(), // we will call login function
          description: "Select to login again",
        },
        {
          name: "Exit",
          value: async () => exit(),
          description: "Select to Exit",
        },
      ],
    });

    await answer();
  } catch (err) {
    console.log(err);
  }
}

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
    console.log();
    const leetcodeSessionToken = await input({
      message: "leetcode-session-token: ",
      required: false,
    });

    const codeforcesId = await input({
      message: "codeforces-ID: ",
      required: false,
    });
    const gfgId = await input({ message: "GFG-ID: ", required: false });
    const gfgToken = await input({ message: "GFG Token : ", required: false });

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
    // console.log(response);

    const token = JSON.stringify({
      jwt_token: response.jwt_token,
    });

    fs.writeFileSync("config.json", token);
    console.log("Account created successfully!");

    homePageScreen();
  } catch (err) {
    console.log(err);
    signUpErrorScreenB(err?.err);
  }
}
async function signUpErrorScreenB(error) {
  // console.clear();

  const answer = await select({
    message: `An error occurred while creating your account: ${error}`,
    choices: [
      {
        name: "Try Again",
        value: async () => await signUpScreen(), // we will call login function
        description: "Select to sign up again",
      },
      {
        name: "Exit",
        value: async () => exit(),
        description: "Select to Exit",
      },
    ],
  });

  await answer();
}

async function homePageScreen() {
  console.clear();
  const data = fs.readFileSync("./config.json", "utf-8");
  const config = JSON.parse(data);

  console.log(`Welcome, ${config.username}`);

  const answer = await select({
    message: "What would you like to do? \n",
    choices: [
      {
        name: "View Recent Submissions",
        value: async () => await recentSubmissionsScreen(),
        description:
          "Select to see the recent submissions across different platforms",
      },
      {
        name: "View Profile Status",
        value: async () => await profileStatusScreen(),
        description: "Select to see your profile status",
      },
      {
        name: "Manage Account",
        value: async () => await manageAccountScreen(),
        description: "Select to manage your account",
      },
      {
        name: "Exit",
        value: async () => await exit(),
        description: "Select to Exit",
      },
    ],
  });
  await answer();
}

async function recentSubmissionsScreen() {
  try {
    console.clear();
    const NO_OF_SUBMISSIONS_PER_PAGE = 5;
    const userData = JSON.parse(fs.readFileSync("config.json"));
    const spinner = createSpinner("Loading Recent submissions").start();
    let memo = {}; // cache
    let offset = 0;
    let lcData = [];
    while (true) {
      const data = (
        await axios.post(
          `${url}/leetcode/recents?limit=5&offset=${offset}`,
          { lcData },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt_token}`,
            },
          }
        )
      ).data;
      if (data.length == 0) break;

      lcData = [...lcData, ...data];
      offset += NO_OF_SUBMISSIONS_PER_PAGE;
    }

    let cfData = (
      await axios.get(`${url}/codeforces/recents`, {
        headers: {
          Authorization: `Bearer ${userData.jwt_token}`,
        },
      })
    ).data;


    // gfg work --> 

    let gfgData = (
        await axios.get(`${url}/gfg/recents`, {
          headers : {
            Authorization : `Bearer ${userData.jwt_token}`
          },
        })
      ).data;


    let total = [...lcData, ...cfData, ...gfgData];
    total.sort((a, b) => b.timestamp - a.timestamp);
    let temp = [];
    total.forEach((element, i) => {
      temp.push(total[i]);
      if ((i + 1) % NO_OF_SUBMISSIONS_PER_PAGE == 0) {
        console.log(i);
        memo[(i + 1) / NO_OF_SUBMISSIONS_PER_PAGE] = temp;
        temp = [];
      }
    });
    memo[Object.keys(memo)[Object.keys(memo).length - 1]] = temp;

    const pageSize = NO_OF_SUBMISSIONS_PER_PAGE;
    let currentPage = 0; // page no

    const totalPages = Math.floor(total.length / pageSize);
    async function renderPage(currentPage) {
      spinner.success();
      console.clear();
      const table = new Table({
        head: ["Problem", "Platform", "Difficulty", "Submitted On (GMT)"],
        colWidths: [60, 15, 15, 25],
      });
      console.log("Fetching your latest submissions...");
      console.log(
        `Viewing: Page ${currentPage + 1} of ${totalPages} (Use ←/→ to navigate pages)`
      );

      const pageData = memo[currentPage + 1];
      pageData?.forEach((row) =>
        table.push([
          row.title,
          row.platform,
          row.difficulty,
          timestampToDate(row.timestamp),
        ])
      );

      console.log(table.toString());
			
      console.log("\n(Press 'esc' to return to the main menu...)");
    }

    await renderPage(currentPage);

    process.stdin.on("keypress", function (ch, key) {
      if (key && key.name == "escape") {
        homePageScreen();
      } else if (key && key.name == "left") {
        if (currentPage > 0) {
          renderPage(--currentPage);
        }
      } else if (key && key.name == "right") {
        if (currentPage + 1 <= totalPages - 1) {
          renderPage(++currentPage);
        }
      }
    });

    keypress(process.stdin);

    process.stdin.setRawMode(true);
    process.stdin.resume();
  } catch (err) {
    console.log(err);
  }
}
