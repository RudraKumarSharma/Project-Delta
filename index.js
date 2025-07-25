#!usr/bin/env node
import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs';
import keypress from 'keypress';
import { select, Separator, input, password } from '@inquirer/prompts';
import Table from "cli-table3";
import { stringify } from 'querystring';

function exit() {
    console.clear();
};

const url = "http://localhost:3000";
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
        console.log('');
        console.log('Authenticating with the server...');
        const token = JSON.stringify(response);
        fs.writeFileSync("config.json", token);

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
        loginScreenError(err);
    }
}

async function loginScreenError(err) {
    console.clear();
    try {

        const answer = await select({
            message: `Incorrect username or password. Please try again : ${err}`,
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
        const leetcodeSessionToken = await input({ message: 'leetcode-session-token: ', required: false });
        const leetcodeId = await input({ message: 'leetcodeId: ', required: false });
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
        const response = (await axios.post(`${url}/auth/signup`, body)).data;
        const token = JSON.stringify(response);
        fs.writeFileSync("config.json", token);
        console.log('Account created successfully!');
    }
    catch (err) {
        console.log(err);

        signUpErrorScreenB(err?.err);
    }

}

// async function signUpErrorScreenA() {

// }

async function signUpErrorScreenB(error) {
    console.clear();

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
                value: async () => recentSubmissionsScreen(),
                description: 'Select to see the recent submissions across different platforms',
            },
            {
                name: 'View Profile Status',
                value: async () => profileStatusScreen(),
                description: 'Select to see your profile status',
            },
            {
                name: 'Manage Account',
                value: async () => manageAccountScreen(),
                description: 'Select to manage your account',
            },
            {
                name: 'Exit',
                value: async () => exit(),
                description: 'Select to Exit',
            }
        ]
    })

    await answer();
}

async function recentSubmissionsScreen() {
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
    let currentPage = 0;
    const totalPages = Math.ceil(submissions.length / pageSize);

    function renderPage() {
    console.clear();
    console.log("Fetching your latest submissions...");
    console.log(
    `Viewing: Page ${currentPage + 1} of ${totalPages} (Use ←/→ to navigate pages)`
    );

    const table = new Table({
    head: ["Problem", "Platform", "Difficulty", "Submitted On"],
    colWidths: [15, 15, 15, 25],
    });

    const start = currentPage * pageSize;
    const end = start + pageSize;
    const pageData = submissions.slice(start, end);

    pageData.forEach((row) => table.push(row));
    console.log(table.toString());
    console.log("\n(Press 'esc' to return to the main menu...)");

    keypress(process.stdin);

    process.stdin.on("keypress", function (ch, key) {
    if (key && key.name == "escape") {
        homePageScreen();
    } else if (key && key.name == "left") {
        if (currentPage > 0) {
        renderPage(--currentPage);
        }
    } else if (key && key.name == "right") {
        if (currentPage < totalPages - 1) {
        renderPage(++currentPage);
        }
    }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
    }

    renderPage(currentPage);
}

async function manageAccountScreen() {
    console.clear();

    try{
        const answer = await select({
            message: 'Manage connected platforms',
            choices: [
                {
                    name: 'Leetcode-Session-Token',
                    value: async() => await leetcodeSessionTokenUpdateScreen(),
                    description: 'goto->chrome->leetcode_profile->inspect->application->filter(LEETCODE-SESSION)',
                },
                {
                    name: 'Leetcode-Id',
                    value: async() => await leetcodeIDUpdateScreen(),
                    description: 'Your leetcode username',
                },
                {
                    name: 'Codeforces-Id\n',
                    value: async() => await codeforcesIDUpdateScreen(),
                    description: 'update codeforces username',
                },
                {
                    name: 'Return to main-menu',
                    value: async() => await homePageScreen(),
                    description: 'press to go back to menu',
                },
            ]
        });

        keypress(process.stdin);

        process.stdin.on("keypress", function (ch, key) {
            if (key && key.name == "escape") {
                homePageScreen();
            }
        });
        process.stdin.setRawMode(true);
        process.stdin.resume();

        await answer();

    }
    catch(err){
        console.log(err);
    }

    console.log('');
    console.log('Updating your account...');
    console.log('Account updated successfully!');
}

async function leetcodeSessionTokenUpdateScreen() {

}

async function leetcodeIDUpdateScreen() {

}

async function codeforcesIDUpdateScreen() {

}
