import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import si from "systeminformation";
import psList  from "ps-list";

let running_process: any[];
let game_names: string[] = [];
let lastgame = "";
let surname = "";
interface gameprocess {
  gameName: string;
  processName: string;
}

const dagames: gameprocess[] = [
  { gameName: "Counter-Strike 2", processName: "cs2.exe" },
  { gameName: "League of Legends (In Menu)", processName: "LeagueClient.exe" },
  { gameName: "League of Legends (In Game)", processName: "League of Legends.exe" },
  { gameName: "VALORANT", processName: "VALORANT-Win64-Shipping.exe" },
  { gameName: "Dota 2", processName: "dota2.exe" },
  { gameName: "Apex Legends", processName: "r5apex.exe" },
  { gameName: "Fortnite", processName: "FortniteClient-Win64-Shipping.exe" },
  { gameName: "Call of Duty: Warzone / MW3", processName: "cod.exe" },
  { gameName: "Overwatch 2", processName: "Overwatch.exe" },
  { gameName: "Rocket League", processName: "RocketLeague.exe" },
  { gameName: "Tom Clancy's Rainbow Six Siege", processName: "RainbowSix.exe" },
  { gameName: "Dead by Daylight", processName: "DeadByDaylight-Win64-Shipping.exe" },
  { gameName: "Rust", processName: "RustClient.exe" },
  { gameName: "Team Fortress 2", processName: "hl2.exe" },
  { gameName: "Destiny 2", processName: "destiny2.exe" },
  { gameName: "Warframe", processName: "Warframe.x64.exe" },
  { gameName: "World of Warcraft", processName: "Wow.exe" },
  { gameName: "World of Tanks", processName: "WorldOfTanks.exe" },
  { gameName: "Genshin Impact", processName: "GenshinImpact.exe" },
  { gameName: "Grand Theft Auto V", processName: "GTA5.exe" },
  { gameName: "Red Dead Redemption 2", processName: "RDR2.exe" },
  { gameName: "The Witcher 3: Wild Hunt", processName: "witcher3.exe" },
  { gameName: "Cyberpunk 2077", processName: "Cyberpunk2077.exe" },
  { gameName: "Elden Ring", processName: "eldenring.exe" },
  { gameName: "Baldur's Gate 3", processName: "bg3.exe" },
  { gameName: "The Elder Scrolls V: Skyrim SE", processName: "SkyrimSE.exe" },
  { gameName: "Fallout 4", processName: "Fallout4.exe" },
  { gameName: "Hogwarts Legacy", processName: "HogwartsLegacy.exe" },
  { gameName: "Starfield", processName: "Starfield.exe" },
  { gameName: "Assassin's Creed Valhalla", processName: "ACValhalla.exe" },
  { gameName: "Assassin's Creed Odyssey", processName: "ACOdyssey.exe" },
  { gameName: "God of War", processName: "GoW.exe" },
  { gameName: "Marvel's Spider-Man Remastered", processName: "Spider-Man.exe" },
  { gameName: "Horizon Zero Dawn", processName: "HorizonZeroDawn.exe" },
  { gameName: "Days Gone", processName: "DaysGone-Win64-Shipping.exe" },
  { gameName: "Monster Hunter: World", processName: "MonsterHunterWorld.exe" },
  { gameName: "Monster Hunter Rise", processName: "MonsterHunterRise.exe" },
  { gameName: "Diablo IV", processName: "Diablo IV.exe" },
  { gameName: "Path of Exile", processName: "PathOfExile.exe" },
  { gameName: "Minecraft", processName: "javaw.exe" },
  { gameName: "Terraria", processName: "Terraria.exe" },
  { gameName: "Valheim", processName: "valheim.exe" },
  { gameName: "ARK: Survival Evolved", processName: "ShooterGame.exe" },
  { gameName: "The Forest", processName: "TheForest.exe" },
  { gameName: "Sons of the Forest", processName: "SonsOfTheForest.exe" },
  { gameName: "Subnautica", processName: "Subnautica.exe" },
  { gameName: "Palworld", processName: "Palworld-Win64-Shipping.exe" },
  { gameName: "Lethal Company", processName: "Lethal Company.exe" },
  { gameName: "Phasmophobia", processName: "Phasmophobia.exe" },
  { gameName: "The Sims 4", processName: "TS4_x64.exe" },
  { gameName: "Euro Truck Simulator 2", processName: "eurotruck2.exe" },
  { gameName: "Assetto Corsa", processName: "acs.exe" },
  { gameName: "Forza Horizon 5", processName: "ForzaHorizon5.exe" },
  { gameName: "Microsoft Flight Simulator", processName: "FlightSimulator.exe" },
  { gameName: "Cities: Skylines", processName: "Cities.exe" },
  { gameName: "Cities: Skylines II", processName: "Cities2.exe" },
  { gameName: "Stardew Valley", processName: "Stardew Valley.exe" },
  { gameName: "RimWorld", processName: "RimWorldWin64.exe" },
  { gameName: "Factorio", processName: "factorio.exe" },
  { gameName: "Hearts of Iron IV", processName: "hoi4.exe" },
  { gameName: "Europa Universalis IV", processName: "eu4.exe" },
  { gameName: "Crusader Kings III", processName: "ck3.exe" },
  { gameName: "Sid Meier's Civilization VI", processName: "CivilizationVI.exe" },
  { gameName: "Total War: Warhammer III", processName: "Warhammer3.exe" },
  { gameName: "Age of Empires II: DE", processName: "AoE2DE_s.exe" },
  { gameName: "Football Manager 2024", processName: "fm.exe" },
  { gameName: "Hades", processName: "Hades.exe" },
  { gameName: "Hollow Knight", processName: "hollow_knight.exe" },
  { gameName: "Dead Cells", processName: "deadcells.exe" },
  { gameName: "Vampire Survivors", processName: "VampireSurvivors.exe" },
  { gameName: "Outer Wilds", processName: "OuterWilds.exe" },
  { gameName: "Slay the Spire", processName: "SlayTheSpire.exe" },
  { gameName: "The Binding of Isaac: Rebirth", processName: "isaac-ng.exe" },
  { gameName: "Undertale", processName: "UNDERTALE.exe" },
  { gameName: "Among Us", processName: "Among Us.exe" },
  { gameName: "Fall Guys", processName: "FallGuysEACLauncher.exe" },
  { gameName: "It Takes Two", processName: "ItTakesTwo.exe" },
  { gameName: "A Way Out", processName: "AWayOut.exe" },
  { gameName: "Detroit: Become Human", processName: "DetroitBecomeHuman.exe" },
  { gameName: "Red Dead Redemption", processName: "RDR.exe" },
  { gameName: "Alan Wake 2", processName: "AlanWake2.exe" },
  { gameName: "Control", processName: "Control.exe" },
  { gameName: "Resident Evil 4", processName: "re4.exe" },
  { gameName: "Resident Evil Village", processName: "re8.exe" },
  { gameName: "Devil May Cry 5", processName: "DMC5.exe" },
  { gameName: "Doom Eternal", processName: "DOOMEternalx64vk.exe" },
  { gameName: "Sekiro: Shadows Die Twice", processName: "sekiro.exe" },
  { gameName: "Dark Souls III", processName: "darksouls3.exe" },
  { gameName: "Lies of P", processName: "LiesofP-Win64-Shipping.exe" },
  { gameName: "Helldivers 2", processName: "helldivers2.exe" },
  { gameName: "Sea of Thieves", processName: "SoTGame.exe" },
  { gameName: "Deep Rock Galactic", processName: "FSD-Win64-Shipping.exe" },
  { gameName: "Left 4 Dead 2", processName: "left4dead2.exe" },
  { gameName: "Payday 2", processName: "payday2_win32_release.exe" },
  { gameName: "Payday 3", processName: "PAYDAY3-Win64-Shipping.exe" },
  { gameName: "Dying Light", processName: "DyingLightGame.exe" },
  { gameName: "Dying Light 2", processName: "DyingLight2_rwdi.exe" },
  { gameName: "Metro Exodus", processName: "MetroExodus.exe" },
  { gameName: "Borderlands 3", processName: "Borderlands3.exe" },
  { gameName: "Celeste", processName: "Celeste.exe"}
];

const client = new WebClient(process.env.SLACK_USER_TOKEN);
var status = -1;
var laststatus = 0;
let isramok: boolean;
let iscpuok: boolean;
let isrammid: boolean;
let iscpumid: boolean;
let iscpuisdying: boolean;
let isramisdying: boolean;

function getrandomnumber(max: number, min: number) {
    return Math.floor(Math.random() * (max-min+1))+ min
}

async function getusersdisplayname() {
    let userinfo = await client.users.info({ user: process.env.SLACK_ID! });
    let displayname = userinfo.user?.profile?.display_name;
    if (!displayname) return undefined;
    return displayname.replace(/\s*\((playin'.*?|Not playin'.*?)\)$/, "");
}

async function edit_surname() {
    let displayname = await getusersdisplayname();
    if (displayname === undefined) {
        console.log("sorry but i dont think this id is exist so pls check your id!!");
        return;
    }

    running_process = await psList();

    game_names = [];

    for(let i=0; i < running_process.length; i++) {
        let process = running_process[i];
        if (dagames.some(dagame => dagame.processName === process!.name)) {
            let dagamename = dagames.find(dagame => dagame.processName === process!.name);
            game_names.push(dagamename!.gameName);
        }
    }
    
    let randomnumber = getrandomnumber(game_names.length -1, 0);

    if (game_names.length === 0) {
        if (lastgame === "(Not playin' any game)") {
            return;
        }
        await client.users.profile.set({
            profile: {
                "display_name": displayname + " (Not playin' any game)"
            }
        });
        lastgame = "(Not playin' any game)";
        return;
    }

    if (game_names.includes("League of Legends (In Game)")) {
        surname = "League of Legends (In Game)";
    } else {
        randomnumber = getrandomnumber(game_names.length -1, 0);
        surname = game_names[randomnumber] ?? "(Not playin' any game)";
    }
    if (surname === lastgame) {
        return;
    }

    await client.users.profile.set({
        profile: {
            "display_name": displayname + " (playin' " + surname + ")"
        }
    });
    lastgame = surname;
}

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
    } if (ramusage >= 99){
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
    } if (cpuusage >= 99) {
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
        await getstatusvalue();
        await edit_surname();
        if (laststatus === status) return;
        await updatestatus();
        laststatus = status;
    } catch (err) {
        console.log(err);
    }
}, 5000);