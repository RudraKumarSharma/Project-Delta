#!usr/bin/env node
import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs';
import keypress from 'keypress';
import { select, Separator, input, password } from '@inquirer/prompts';
import Table from "cli-table3";
import cliSpinners from 'cli-spinners';
import { createSpinner } from 'nanospinner';
import { partialDeepStrictEqual } from 'assert';
function exit() {
    console.clear();
};




const url = "http://localhost:3000";

if (fs.readFileSync("config.json").length!=0) {
    let token = JSON.parse(fs.readFileSync("config.json"));

    axios(`${url}/auth/check-auth`,{
        headers : {
            'Authorization' : `Bearer ${token.jwt_token}`
        }
    }).then(async () => {
        await homePageScreen();
    }).catch(async () => await parentScreen());
}



async function parentScreen() {
    try {

        console.clear();
        console.log('┌──────────────────────────────────────────┐');
        console.log('│                                          │');
        console.log('│            Welcome to #track             │');
        console.log('│                                          │');
        console.log('└──────────────────────────────────────────┘');



        const answer = await select({
            message: 'Please log in to view your progress.',
            choices: [
                {
                    name: 'login',
                    value: async () => await loginScreen(), // we will call login function
                    description: 'Select to Login',
                },
                {
                    name: 'Sign up',
                    value: async () => await signUpScreen(), // signup function call
                    description: 'Select to signup for new users',
                },
                {
                    name: 'Exit',
                    value: async () => exit(),
                    description: 'Select to Exit',
                },
            ],
        });

        await answer();

    }
    catch (err) {
        console.log("an error occured in parent function : ", err);
    }
}

parentScreen();
// recentSubmissionsScreen();

async function loginScreen() {
    try {
        console.clear();
        console.log('Please enter your account details.');
        console.log('');

        const username = await input({ message: 'Username: ', required: true });
        const password = await input({ message: 'Password: ', required: true });

        const body = {
            username,
            password
        };
        const response = (await axios.post(`${url}/auth/login`, body)).data;
        console.log(response);
        console.log('');
        const token = JSON.stringify({
            jwt_token: response.jwt_token
        });

        fs.writeFileSync("config.json", token);
        console.log('Authenticating with the server...');
        console.log('Login Successful');
        console.log("\n(Press 'enter' to continue.)");

        keypress(process.stdin);
        process.stdin.on("keypress", function (ch, key) {
            // console.log(key);
            if (key && key.name == "return") {
                homePageScreen();
            }
        });

        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
    catch (err) {
        if (err.response.status == 401) {
            loginScreen("")
        }
        loginScreenError(err);
    }
}

async function loginScreenError(err) {
    // console.clear();
    try {

        const answer = await select({
            message: `${err}`,
            choices: [
                {
                    name: 'Try Again',
                    value: async () => await loginScreen(), // we will call login function
                    description: 'Select to login again',
                },
                {
                    name: 'Exit',
                    value: async () => exit(),
                    description: 'Select to Exit',
                },
            ],
        });

        await answer();

    }
    catch (err) {
        console.log(err);
    }

}

async function signUpScreen() {
    try {
        console.clear();
        const email = await input({ message: "Email : ", required: true })
        const username = await input({ message: 'username: ', required: true });
        const password = await input({ message: 'password: ', required: true });
        const leetcodeId = await input({ message: 'leetcodeId: ', required: false });
        console.log()
        const leetcodeSessionToken = await input({ message: 'leetcode-session-token: ', required: false });

        const codeforcesId = await input({ message: 'codeforces-ID: ', required: false });
        const gfgId = await input({ message: 'GFG-ID: ', required: false });
        const gfgToken = await input({ message: "GFG Token : ", required: false })

        console.log('');
        console.log('Creating your account...');

        const body = {
            username,
            password,
            leetcodeSessionToken,
            leetcodeId,
            codeforcesId,
            gfgId,
            email,
            gfgToken
        };
        console.log(body);

        const response = (await axios.post(`${url}/auth/signup`, body)).data;
        // console.log(response);

        const token = JSON.stringify({
          jwt_token: response.jwt_token,
        });

        fs.writeFileSync("config.json", token);
        console.log('Account created successfully!');

        homePageScreen();
    }
    catch (err) {
        console.log(err);

        signUpErrorScreenB(err?.err);
    }

}

// async function signUpErrorScreenA() {

// }

async function signUpErrorScreenB(error) {


    const answer = await select({
        message: `An error occurred while creating your account: ${error}`,
        choices: [
            {
                name: 'Try Again',
                value: async () => await signUpScreen(), // we will call login function
                description: 'Select to sign up again',
            },
            {
                name: 'Exit',
                value: async () => exit(),
                description: 'Select to Exit',
            },
        ],
    });

    await answer();
}

async function homePageScreen() {

    console.clear();
    const data = fs.readFileSync('./config.json', 'utf-8');
    const config = JSON.parse(data);

    console.log(`Welcome, ${config.username}`);

    const answer = await select({
        message: 'What would you like to do? \n',
        choices: [
            {
                name: 'View Recent Submissions',
                value: async () => await recentSubmissionsScreen(),
                description: 'Select to see the recent submissions across different platforms',
            },
            {
                name: 'View Profile Status',
                value: async () => await profileStatusScreen(),
                description: 'Select to see your profile status',
            },
            {
                name: 'Manage Account',
                value: async () => await manageAccountScreen(),
                description: 'Select to manage your account',
            },
            {
                name: 'Exit',
                value: async () => await exit(),
                description: 'Select to Exit',
            }
        ]
    })
    await answer();
}

async function recentSubmissionsScreen() {
    try {

        const userData = JSON.parse(fs.readFileSync("config.json"));


        console.clear();
        const NO_OF_SUBMISSIONS_PER_PAGE = 5;

        const submissions = [
            ["Problem 1", "Platform A", "Easy", "2025-07-10 14:30"],
            ["Problem 2", "Platform B", "Easy", "2025-07-09 19:15"],
            ["Problem 3", "Platform A", "Medium", "2025-07-09 11:20"],
            ["Problem 4", "Platform C", "Hard", "2025-07-08 21:05"],
            ["Problem 5", "Platform A", "Medium", "2025-07-08 10:10"],
            ["Problem 6", "Platform B", "Hard", "2025-07-07 09:05"],
            ["Problem 7", "Platform C", "Easy", "2025-07-06 22:30"],
        ];


        const pageSize = NO_OF_SUBMISSIONS_PER_PAGE;
        let currentPage = 0; // page no
        // const totalPages = Math.ceil(submissions.length / pageSize);
        let memo = {}; // cache
        let prevData = []; // to give in req to check already sent data
        async function renderPage(currentPage) {
            const spinner = createSpinner('Loading Recent submissions').start();
            const table = new Table({
                head: ["Problem", "Platform", "Difficulty", "Submitted On"],
                colWidths: [60, 15, 15, 25],
            });
            console.clear();
            console.log("Fetching your latest submissions...");
            console.log(
                `Viewing: Page ${currentPage + 1} of - (Use ←/→ to navigate pages)`
            );
            if (!memo[currentPage]) {
                const lcData = (await axios.post(`${url}/leetcode/recents?limit=5&offset=${pageSize * (currentPage)}`, { prevData }, {
                    headers: {
                        'Authorization': `Bearer ${userData.jwt_token}`
                    }
                })).data;
                prevData = [...prevData, ...lcData];
                
                const cfData = (await axios.get(`${url}/codeforces/recents?limit=5&offset=${pageSize * (currentPage)}`, {
                    headers: {
                        'Authorization': `Bearer ${userData.jwt_token}`
                    }
                })).data;
                
                let total = [...lcData, ...cfData];
                total.sort((a, b) => b.timestamp - a.timestamp);

                memo[currentPage] = total;
            }


            const pageData = memo[currentPage];
            pageData.forEach((row) => table.push([row.title, row.platform, row.difficulty, row.timestamp]));

            console.log("\n(Press 'esc' to return to the main menu...)");

            console.log(table.toString());
            spinner.success({text:"Recent Submissions Loaded",update:true});
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
                renderPage(++currentPage);
            }
        });

        // leetCodeData.forEach(item => {
        //     table.push([item.title, item.platform, item.difficulty, item.timestamp]);
        // })
        // cfData.forEach(item => {
        //     table.push([item.title,item.platform,item.difficulty,item.timestamp]);
        // });
        keypress(process.stdin);



        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
    catch (err) {
        console.log(err);
    }


}