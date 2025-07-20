#!usr/bin/env node
import inquirer from 'inquirer';
import keypress from 'keypress';
import { select, Separator, input } from '@inquirer/prompts';


async function parentScreen() {
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
                value: 'Exit',
                description: 'Select to Exit',
            },
        ],
    });

    if (typeof answer === 'function') {
        await answer();
    }
}

parentScreen();

async function loginScreen() {
    console.clear();
    console.log('Please enter your account details.');
    console.log('');

    const username = await input({ message: 'Username: ',  required: true  });
    if (username != '') {
        const password = await input({ message: 'Password: ', required: true });
    }

    console.log('');
    console.log('Authenticating with the server...');

    if (false) {
        console.log('Login Sucessful');
    }
    else {
        loginScreenError();
    }

}

async function loginScreenError() {
    console.clear();

    const answer = await select({
        message: 'Incorrect username or password. Please try again.',
        choices: [
            {
                name: 'Try Again',
                value: async () => await loginScreen(), // we will call login function
                description: 'Select to login again',
            },
            {
                name: 'Exit',
                value: 'Exit',
                description: 'Select to Exit',
            },
        ],
    });

    if (typeof answer === 'function') {
        await answer();
    }

}

async function signUpScreen() {
    console.clear();
    const email = await input({message: 'Email: ', required: true});
    const password = await input({message: 'password: ', required: true});
    const leetcodeSessionToken = await input({message: 'leetcode-session-token: ', required: false});
    const leetcodeId = await input({message: 'leetcodeId: ', required: false});
    const emacodeforcesId = await input({message: 'codeforces-ID: ', required: false});
    const gfgId = await input({message: 'GFG-ID: ', required: false});

    console.log('');
    console.log('Creating your account...');

    // if(signUpErrorScreenA()) {
        
    // }
    if(true) { // if there is any error in the backend server
        signUpErrorScreenB(); 
    }
    else {
        console.log('Account created successfully!');
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
                value: 'Exit',
                description: 'Select to Exit',
            },
        ],
    });

    if (typeof answer === 'function') {
        await answer();
    }
}

