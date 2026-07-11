import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import si from "systeminformation";
import { collapseTextChangeRangesAcrossMultipleVersions, isReadonlyKeywordOrPlusOrMinusToken } from "typescript";

const client = new WebClient(process.env.SLACK_USER_TOKEN);
var status = -1;
var laststatus = 0;
let isramok: boolean;
let iscpuok: boolean;
let isrammid: boolean;
let iscpumid: boolean;
let iscpuisdying: boolean;
let isramisdying: boolean;


async function getsysteminfo() {
    var cpuload = await si.currentLoad();
    var ramload = await si.mem();

    var ramusage = Number ((ramload.used / ramload.total * 100).toFixed(1));
    var cpuusage = Number (cpuload.currentLoad.toFixed(1));

    return {ramusage, cpuusage};
}

const app = new App ({

    token: process.env.SLACK_TOKEN,
    appToken:process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

async function getstatusvalue() {
    var { ramusage, cpuusage } = await getsysteminfo();

    if (ramusage >= 75) {
        isrammid = true;
        isramok = false;
        isramisdying = false;
    } else if (ramusage < 75) {
        isramisdying = false;
        isrammid = false;
        isramok= true;
    } if (ramusage <= 99){
        isramok = false;
        isrammid = false;
        isramisdying = true;
    }

    if (cpuusage >= 60) {
        iscpumid = true;
        iscpuok = false;
        iscpuisdying = false;
    } else if (cpuusage < 60) {
        iscpuok = true;
        iscpumid = false;
        iscpuisdying = false;
    } if (ramusage >= 99) {
        iscpuisdying= true;
        iscpumid = false;
        iscpuok = false;
    }

    if (iscpuisdying && isramisdying) {
        status = 1;
    } else if (iscpumid || isrammid) {
        status = 2;
    } else if (isramok || iscpuok) {
        status = 3;
    }
}

async function updatestatus() {
    if (status === 1) {
        await client.users.profile.set({
            profile: {
                "status_text": "MY PC IS GOING TO EXPLODE",
                "status_emoji": ":siren-real:",
                "status_expiration": 0
            }
        });
    }
    else if(status === 2) {
        await client.users.profile.set({
            profile: {
                "status_text": "Yeah my pc usage is at mid but it think its okay",
                "status_emoji": ":tw_warning:",
                "status_expiration": 0
            }
        });
    } else if(status === 3){
        await client.users.profile.set({
            profile: {
                "status_text": "okie my pc usage is fine",
                "status_emoji": ":tw_white_check_mark:",
                "status_expiration": 0
            }
        });
    }
}

await app.start();
console.log("selfbot started!!!");

setInterval(async () => {
    try {
        getstatusvalue();
        if (laststatus === status) return;
        await updatestatus();
        laststatus = status;
    } catch (err) {
        console.log(err);
    }
}, 3000);