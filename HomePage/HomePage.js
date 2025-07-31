import { select } from "@inquirer/prompts";
import fs from 'fs';
import { exit } from "../index.js";
import logout from "../Logout/Logout.js";
import recentSubmissionsScreen from "../RecentSubmissions/RecentSubmissions.js";
import profileStatusScreen from "../Profilestatus/ProfileStatus.js"; 
import manageAccountScreen from "../ManageAccount/ManageAccount.js";
async function homePageScreen() {
    console.clear();
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
                name: "Logout",
                value: async () => await logout(),
                description: "Select to Logout",
            },
            {
                name: "Exit",
                value: async () => await exit(),
                description: "Select to Exit",
            },
        ],
    });
   return  (await answer());
}

export default homePageScreen;