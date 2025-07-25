import { select } from "@inquirer/prompts";
import { exit } from "../index.js";
import loginScreen  from "./Login.js";
async function loginScreenError(err) {
    console.clear();
    try {
        const answer = await select({
            message: `${err}`,
            choices: [
                {
                    name: "Try Again",
                    value: async () => await loginScreen(), // we will call login function
                    description: "Select to login again",
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
        console.log(err);
    }
}
export default loginScreenError;