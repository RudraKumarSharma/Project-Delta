import { select } from "@inquirer/prompts";
import loginScreen from "../Login/Login.js";
import { exit } from "../index.js";
import signUpScreen from "../Signup/Signup.js";
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

export default parentScreen;
