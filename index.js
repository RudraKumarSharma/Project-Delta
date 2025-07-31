#!usr/bin/env node
import axios from "axios";
import fs from "fs";
import keypress from "keypress";
import parentScreen from "./ParentPage/ParentPage.js";
import homePageScreen from "./HomePage/HomePage.js";
function exit() {
    console.clear();
}

let keyListenerAttached = false;

function keyPress(keyFunction) {
    if (!keyListenerAttached) {
        keypress(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        keyListenerAttached = true;
    }

    process.stdin.removeAllListeners("keypress");
    process.stdin.on("keypress", keyFunction);
}
function cleanupKeyListener() {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdin.removeAllListeners("keypress");
    keyListenerAttached = false;
}
function timestampToDate(timestamp) {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formatted;
}
function getJWTtoken() {
    const { jwt_token } = JSON.parse(fs.readFileSync("config.json"));
    return jwt_token;
}
const url = "http://localhost:3000";



async function checkLoginSession() {
    if (fs.readFileSync("config.json").length != 0) {
        let token = JSON.parse(fs.readFileSync("config.json"));

        axios(`${url}/auth/check-auth`, {
            headers: {
                Authorization: `Bearer ${token.jwt_token}`,
            },
        })
            .then(async () => {
                await homePageScreen();
            })
            .catch(async () => await parentScreen());
    } else {
        await parentScreen();
    }
}

checkLoginSession();
export { exit, keyPress, timestampToDate, getJWTtoken, url,cleanupKeyListener }
