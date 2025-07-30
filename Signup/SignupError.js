import signUpScreen from "./Signup.js";
import { exit } from "../index.js";
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
export default signUpErrorScreenB;