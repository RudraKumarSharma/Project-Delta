import recentSubmissionsScreen from "./RecentSubmissions.js";
import { exit } from "../index.js";
import { select } from "@inquirer/prompts";
async function recentSubError(error) {
    console.clear();
    const answer = await select({
        message: `An error occurred while fetching submissions: ${error}`,
        choices: [
            {
                name: "Try Again",
                value: async () => await recentSubmissionsScreen(), // we will call login function
                description: "Select to try again",
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
export default recentSubError;