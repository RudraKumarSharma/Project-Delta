#!usr/bin/env node
import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs';
import keypress from 'keypress';
import { select, Separator, input, password } from '@inquirer/prompts';


function exit() { };

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
                Value: async () => recentSubmissionsScreen(),
                description: 'Select to see the recent submissions across different platforms',
            },
            {
                name: 'View Profile Status',
                Value: async () => profileStatusScreen(),
                description: 'Select to see your profile status',
            },
            {
                name: 'Manage Account',
                Value: async () => manageAccountScreen(),
                description: 'Select to manage your account',
            },
            {
                name: 'Exit',
                Value: async () => exit(),
                description: 'Select to Exit',
            }
        ]
    })

    await answer();

}

