import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import si from "systeminformation";

const client = new WebClient(process.env.SLACK_USER_TOKEN);
var status = 0;
var laststatus = 0;

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

async function updatestatus() {
    var { ramusage, cpuusage } = await getsysteminfo();

    if (ramusage >= 99 && cpuusage >= 99) {
        await client.users.profile.set({
            profile: {
                "status_text": "MY PC IS GOING TO EXPLODE",
                "status_emoji": ":siren-real:",
                "status_expiration": 0
            }
        });
        status = 1;
    }
    else if(ramusage >= 95 && cpuusage >= 80) {
        await client.users.profile.set({
            profile: {
                "status_text": "Yeah my pc usage is at mid but it think its okay",
                "status_emoji": ":tw_warning:",
                "status_expiration": 0
            }
        });
        status = 2;
    }
    else {
        await client.users.profile.set({
            profile: {
                "status_text": "okie my pc usage is fine",
                "status_emoji": ":tw_white_check_mark:",
                "status_expiration": 0
            }
        });
        status = 3;
    }
}

await app.start();
console.log("selfbot started!!!");

setInterval(async () => {
    try {
        if (laststatus === status) return;
        await updatestatus();
        laststatus = status;
    } catch (err) {
        console.log(err);
    }
}, 3000);