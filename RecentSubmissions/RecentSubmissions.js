import axios from "axios";
import { cleanupKeyListener, url } from "../index.js";
import { getJWTtoken } from "../index.js";
import Table from "cli-table3";
import { createSpinner } from "nanospinner";
import { keyPress } from "../index.js";
import keypress from "keypress";
import homePageScreen from "../HomePage/HomePage.js";
import { timestampToDate } from "../index.js";
import recentSubError from "./recentSubmissionsError.js";

async function fetchSubmissions(platform) {
  try {
    let data = (
      await axios.get(`${url}/${platform}/recents`, {
        headers: {
          Authorization: `Bearer ${getJWTtoken()}`,
        },
      })
    ).data;

    return data;
  } catch (err) {}
}

async function recentSubmissionsScreen() {
  try {
    console.clear();
    let isLoading = true;
    const NO_OF_SUBMISSIONS_PER_PAGE = 5;
    const spinner = createSpinner("Loading Recent submissions").start();
    let memo = {}; // cache
    let total = [];

    keyPress(function (ch, key) {
      if (isLoading) {
        return;
      }
    });

    try {
      let lcData = await fetchSubmissions("leetcode");
      total = [...total, ...lcData];
    } catch (err) {}

    try {
      let cfData = await fetchSubmissions("codeforces");
      total = [...total, ...cfData];
    } catch (err) {}

    try {
      let gfgData = await fetchSubmissions("gfg");
      total = [...total, ...gfgData];
    } catch (err) {}


    isLoading = false;
    spinner.success();

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
          row.difficulty.toLowerCase(),
          timestampToDate(row.timestamp),
        ])
      );

      console.log(table.toString());

      console.log("\n(Press 'esc' to return to the main menu...)");
    }

    await renderPage(currentPage);
    keyPress((ch, key) => {
      if (key && key.name == "escape") {
        cleanupKeyListener();
        return homePageScreen();
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
  } catch (err) {
    recentSubError(
      "An unexpected error occurred while fetching submissions. Please try again later."
    );
  }
}

export default recentSubmissionsScreen;
