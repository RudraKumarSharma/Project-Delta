import { createSpinner } from "nanospinner";
import { keyPress } from "../index.js";
import axios from 'axios';
import homePageScreen from "../HomePage/HomePage.js";
import Table from "cli-table3";
import { url } from "../index.js";
import { getJWTtoken } from "../index.js";
async function fetchStats(platform) {

	if(platform === "codeforces") {
		const data = (
			await axios.get(
				`${url}/codeforces/question-count`, {
					headers: {
						Authorization: `Bearer ${getJWTtoken()}`,
					},
				}
			)
		).data;

		return data;
	}

	if(platform === "leetcode") {
		const data = (
			await axios.get(
				`${url}/leetcode/question-count`, {
					headers: {
						Authorization: `Bearer ${getJWTtoken()}`,
					},
				}
			)
		).data;

		return data;
	}

}
async function profileStatusScreen() {
    try {
        console.clear();

        const spinner = createSpinner("Loading your profile stats").start();
        let pages = [];
        let currentPage = 0;

        if (true) { // connected("leetcode")
            let lcData = await fetchStats("leetcode");
            pages.push({ platform: "Leetcode", data: lcData });
        }
        if (true) { // connected("codeforces")
            let cfData = await fetchStats("codeforces");
            pages.push({ platform: "Codeforces", data: cfData });
        }

        let d = {
            easy: 0,
            medium: 0,
            hard: 0,
            total: 0,
        };
        for (let i = 0; i < pages.length; i++) {
            d.easy += pages[i].data.easy;
            d.medium += pages[i].data.medium;
            d.hard += pages[i].data.hard;
            d.total += pages[i].data.total;
        }

        pages.push({ platform: "Overall", data: d });

        spinner.success();
        console.clear();

        async function renderPage(currentPage) {
            console.clear();
            console.log(
                `Viewing: [${pages[currentPage].platform}] (Use ←/→ to change platform)`
            );

            const table = new Table({
                head: ["Difficulty", "Count"],
                colWidths: [15, 10],
            });

            const pageData = pages[currentPage];

            table.push(["Easy",
                pageData.data.easy
            ])
            table.push(["Medium",
                pageData.data.medium
            ])
            table.push(["Hard",
                pageData.data.hard
            ])
            table.push([
                "Total ",
                pageData.data.easy + pageData.data.medium + pageData.data.hard,
            ]);

            console.log(table.toString());

            console.log("\n(Press 'esc' to return to the main menu...)");
        }
        renderPage(currentPage)

        
        keyPress(function (ch, key) {
            if (key && key.name == "escape") {
                homePageScreen();
            } else if (key && key.name == "left") {
                if (currentPage > 0) {
                    renderPage(--currentPage);
                }
            } else if (key && key.name == "right") {
                if (currentPage + 1 <= pages.length - 1) {
                    renderPage(++currentPage);
                }
            }
        });
        
        
    } catch (err) {
        console.error("An error occurred in profileStatusScreen:", err);
    }
}

export default profileStatusScreen;