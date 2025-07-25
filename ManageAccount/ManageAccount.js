import { input } from "@inquirer/prompts";
import axios from 'axios';
import { keyPress } from "../index.js";
import homePageScreen from "../HomePage/HomePage.js";
import { getJWTtoken } from "../index.js";
import { url } from "../index.js";
async function manageAccountScreen() {
    try {

        const leetcodeSessionToken = await input({ message: "LeetcodeSessionToken : ", required: false });
        const leetcodeId = await input({ message: "LeetcodeId :" });
        const codeforcesId = await input({ message: "CodeforcesId : " });
        const gfgId = await input({ message: "GfgId: " });
        const gfgCookie = await input({ message: "Gfg Cookie: " })
        const lcBody = {
            leetcodeSessionToken: leetcodeSessionToken.length != 0 ? leetcodeSessionToken : undefined,
            leetcodeId: leetcodeId.length != 0 ? leetcodeId : undefined
        };
        const cfBody = {
            codeforcesId: codeforcesId.length != 0 ? codeforcesId : undefined
        }
        const gfgBody = {
            gfgId: gfgId.length != 0 ? gfgId : undefined,
            gfgCookie: gfgCookie.length != 0 ? gfgCookie : undefined
        };
        const requests = [{
            url: "/leetcode/update-details",
            body: lcBody
        },
        {
            url: "/codeforces/update-details",
            body: cfBody
        },
        {
            url: "/gfg/update-details",
            body: gfgBody
        }];
        let promiseArray = [];
        requests.forEach(element => promiseArray.push(axios.post(`${url}${element.url}`, element.body, {
            headers: {
                'Authorization': `Bearer ${getJWTtoken()}`
            }
        })));
        await Promise.all(promiseArray);
        console.log("Please press 'enter' to continue...");
        keyPress(async (ch, key) => {
            if (key && key.name === 'return') {
                await homePageScreen();
            }
        });
    }
    catch (err) {
        console.log(err)
    }


}

export default manageAccountScreen;