let tab="games"
let cat="all"
let searchTimeout
let isMuted=false
let isSwitchingTab=false

try{
isMuted=localStorage.getItem("forksNFrogzMuted")==="true"
}catch(e){}

// Cache DOM elements for better performance
let grid,search,frame,player,secret,tooltip,muteBtn

function initializeDOMReferences(){
grid=document.getElementById("grid")
search=document.getElementById("search")
frame=document.getElementById("frame")
player=document.getElementById("player")
muteBtn=document.getElementById("muteBtn")
secret=document.getElementById("secret")
tooltip=document.getElementById("tooltip")
updateMuteButton()
frame?.addEventListener("load",()=>{
  updateMuteButton()
  applyMuteStateToCurrentGame()
})
}

// MacBook-specific optimizations
const isMacBook=/Mac|iPhone|iPad|iPod/.test(navigator.platform)||/Mac|iPhone|iPad|iPod/.test(navigator.userAgentData?.platform)
if(isMacBook){
document.documentElement.style.scrollBehavior="smooth"
// Enable reduce-motion preference support
const prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches
if(!prefersReducedMotion){
document.documentElement.classList.add("macos-optimized")
}
}

const games=[
{title:"1v1.lol",img:"images/1v1.lol.png",url:"games/1v1.lol/index.html",cat:"all"},
{title:"2 Minute Football",img:"images/2 minute football.png",url:"games/2 minute football/index.html",cat:"all"},
{title:"3D.city",img:"images/3D.city.png",url:"games/3D.city/index.html",cat:"all"},
{title:"4th And Goal",img:"images/4th And Goal.png",url:"games/4th And Goal/index.html",cat:"all"},
{title:"40xEscape",img:"images/40xEscape.png",url:"games/40xEscape/index.html",cat:"all"},
{title:"60 Second Burger Run",img:"images/60 Second Burger Run.png",url:"games/60 Second Burger Run/index.html",cat:"all"},
{title:"2048",img:"images/2048.png",url:"games/2048/index.html",cat:"all"},
{title:"A Dance Of Fire And Ice",img:"images/A Dance Of Fire And Ice.png",url:"games/A Dance Of Fire And Ice/index.html",cat:"all"},
{title:"A Small World Cup",img:"images/A Small World Cup.png",url:"games/A Small World Cup/index.html",cat:"all"},
{title:"Ace Attorney (all Games) (DS)",img:"images/Ace Attorney.png",url:"games/Ace Attorney (all games) (NDS)/index.html",cat:"all"},
{title:"Achievement Unlocked",img:"images/Achievement Unlocked.png",url:"games/Achievement Unlocked/index.html",cat:"all"},
{title:"Achievement Unlocked 2",img:"images/Achievement Unlocked 2.png",url:"games/Achievement Unlocked 2/index.html",cat:"all"},
{title:"Achievement Unlocked 3",img:"images/Achievement Unlocked 3.png",url:"games/Achievement Unlocked 3/index.html",cat:"all"},
{title:"Adventure Capitalist",img:"images/Adventure Capitalist.png",url:"games/Adventure Capitalist/index.html",cat:"all"},
{title:"Adventure Drivers",img:"images/Adventure Drivers.png",url:"games/Adventure Drivers/index.html",cat:"all"},
{title:"Agar.io Lite",img:"images/Agar.io Lite.png",url:"games/Agar.io Lite/index.html",cat:"all"},
{title:"Age Of War",img:"images/Age Of War.png",url:"games/Age Of War/index.html",cat:"all"},
{title:"Age Of War 2",img:"images/Age Of War 2.png",url:"games/Age Of War 2/index.html",cat:"all"},
{title:"Airline Tycoon Idle",img:"images/Airline Tycoon Idle.png",url:"games/Airline Tycoon Idle/index.html",cat:"all"},
{title:"Aquapark.io",img:"images/Aquapark.io.png",url:"games/Aquapark.io/index.html",cat:"all"},
{title:"Bad Ice Cream",img:"images/Bad Ice Cream.png",url:"games/Bad Ice Cream/index.html",cat:"all"},
{title:"Bad Ice Cream 2",img:"images/Bad Ice Cream 2.png",url:"games/Bad Ice Cream 2/index.html",cat:"all"},
{title:"Bad Ice Cream 3",img:"images/Bad Ice Cream 3.png",url:"games/Bad Ice Cream 3/index.html",cat:"all"},
{title:"Basket Random",img:"images/Basket Random.png",url:"games/Basket Random/index.html",cat:"all"},
{title:"BasketBall Stars",img:"images/Basketball Stars.png",url:"games/BasketBall Stars/index.html",cat:"all"},
{title:"Bee Swarm Simulator",img:"images/Bee Swarm Simulator.png",url:"games/Bee Swarm Simulator/index.html",cat:"all"},
{title:"Bitlife",img:"images/Bitlife.png",url:"games/Bitlife/index.html",cat:"all"},
{title:"BitPlanes",img:"images/BitPlanes.png",url:"games/BitPlanes/index.html",cat:"all"},
{title:"Block Blast",img:"images/Block Blast.png",url:"games/Block Blast/index.html",cat:"all"},
{title:"Blood Money",img:"images/Blood Money.png",url:"games/Blood Money/index.html",cat:"all"},
{title:"Bloons TD 1",img:"images/Bloons TD 1.png",url:"games/Bloons TD 1/index.html",cat:"all"},
{title:"Bloons TD 2",img:"images/Bloons TD 2.png",url:"games/Bloons TD 2/index.html",cat:"all"},
{title:"Bloons TD 3",img:"images/Bloons TD 3.png",url:"games/Bloons TD 3/index.html",cat:"all"},
{title:"Bloons TD 5",img:"images/Bloons TD 5.png",url:"games/Bloons TD 5/index.html",cat:"all"},
{title:"Bloxorz",img:"images/Bloxorz.png",url:"games/Bloxorz/index.html",cat:"all"},
{title:"Bob The Robber 4",img:"images/Bob The Robber 4.png",url:"games/Bob The Robber 4/index.html",cat:"all"},
{title:"Boxing Random",img:"images/Boxing Random.png",url:"games/Boxing Random/index.html",cat:"all"},
{title:"Candy Crush",img:"images/Candy Crush.png",url:"games/Candy Crush/index.html",cat:"all"},
{title:"Cannon Basketball 4",img:"images/Cannon Basketball 4.png",url:"games/Cannon Basketball 4/index.html",cat:"all"},
{title:"Choppy Orc",img:"images/Choppy Orc.png",url:"games/Choppy Orc/index.html",cat:"all"},
{title:"Christmas Horror 2025",img:"images/Christmas Horror 2025.png",url:"games/Christmas Horror 2025/index.html",cat:"all"},
{title:"Cluster Rush",img:"images/Cluster Rush.png",url:"games/Cluster Rush/index.html",cat:"all"},
{title:"Core Ball",img:"images/Core Ball.png",url:"games/Core Ball/index.html",cat:"all"},
{title:"Crazy Cars",img:"images/Crazy Cars.png",url:"games/Crazy Cars/index.html",cat:"all"},
{title:"Crazy Cattle 3D",img:"images/Crazy Cattle 3D.png",url:"games/Crazy Cattle 3D/index.html",cat:"all"},
{title:"Crazy Motorcycle",img:"images/Crazy Motorcycle.png",url:"games/Crazy Motorcycle/index.html",cat:"all"},
{title:"CS GO Clicker",img:"images/CS GO clicker.png",url:"games/CS GO clicker/index.html",cat:"all"},
{title:"Cyber Cars Punk Racing",img:"images/Cyber Cars Punk Racing.png",url:"games/Cyber Cars Punk Racing/index.html",cat:"all"},
{title:"Dad N Me",img:"images/Dad N Me.png",url:"games/Dad N Me/index.html",cat:"all"},
{title:"Death Run 3D",img:"images/Death Run 3D.png",url:"games/Death Run 3D/index.html",cat:"all"},
{title:"Doge 2048",img:"images/Doge 2048.png",url:"games/Doge 2048/index.html",cat:"all"},
{title:"Doge Miner",img:"images/Doge Miner.png",url:"games/Doge Miner/index.html",cat:"all"},
{title:"Dont You Lecture Me With Your 30 Dollar Website",img:"images/Dont You Lecture Me About Your 30 Dollar Website.png",url:"games/Dont You Lecture Me About Your 30 Dollar Website/index.html",cat:"all"},
{title:"Doom 2",img:"images/Doom 2.png",url:"games/Doom 2/public/index.html",cat:"all"},
{title:"Draw The Hill",img:"images/Draw The Hill.png",url:"games/Draw The Hill/index.html",cat:"all"},
{title:"Dreadhead Parkour",img:"images/Dreadhead Parkour.png",url:"games/Dreadhead Parkour/index.html",cat:"all"},
{title:"Drift Boss",img:"images/Drift Boss.png",url:"games/Drift Boss/index.html",cat:"all"},
{title:"Drive Mad",img:"images/Drive Mad.png",url:"games/Drive Mad/index.html",cat:"all"},
{title:"Duck Life",img:"images/Duck Life.png",url:"games/Duck Life/index.html",cat:"all"},
{title:"Duck Life 2",img:"images/Duck Life 2.png",url:"games/Duck Life 2/index.html",cat:"all"},
{title:"Duck Life 3 Evolution",img:"images/Duck Life 3.png",url:"games/Duck Life 3/index.html",cat:"all"},
{title:"Duck Life 4",img:"images/Duck Life 4.png",url:"games/Duck Life 4/index.html",cat:"all"},
{title:" The Fancy Pants Adventure",img:"images/Fancy Pants Adventure.png",url:"games/Fancy Pants Adventure/index.html",cat:"all"},
{title:"FireBoy And WaterGirl 2 In The Light Temple",img:"images/Fire Boy Water Girl 2.png",url:"games/Fireboy And Water Girl 2 Light temple/index.html",cat:"all"},
{title:"FireBoy And WaterGirl 3 In The Ice Temple",img:"images/fireboy and watergirl 3.png",url:"games/Fireboy And Watergirl 3/index.html",cat:"all"},
{title:"Five Nights At Epsteins",img:"images/Five Nights At Epsteins.png",url:"games/Five Nights At Epsteins/index.html",cat:"all"},
{title:"Flick Goal",img:"images/Flick Goal.png",url:"games/Flick Goal/index.html",cat:"all"},
{title:"Fluidism",img:"images/Fluidism.png",url:"games/Fluidism/index.html",cat:"all"},
{title:"Funny Shooter",img:"images/Funny Shooter.png",url:"games/Funny Shooter/index.html",cat:"all"},
{title:"Geometry Dash",img:"images/GD.png",url:"games/Geometry Dash/index.html",cat:"all"},
{title:"Getaway Shootout",img:"images/Getaway Shootout.png",url:"games/Getaway Shootout/index.html",cat:"all"},
{title:"Gladihoppers",img:"images/Gladihoppers.png",url:"games/Gladihoppers/index.html",cat:"all"},
{title:"Gold Digger FRVR",img:"images/Gold Digger FRVR.png",url:"games/Gold Digger FRVR/index.html",cat:"all"},
{title:"Google Dino",img:"images/Google Dino.png",url:"games/Google Dino/index.html",cat:"all"},
{title:"Google Doodle Champion Island",img:"images/Google Doodle Champion Island.png",url:"games/Google Doodle Champion Island/index.html",cat:"all"},
{title:"Granny",img:"images/Granny.png",url:"games/Granny/index.html",cat:"all"},
{title:"Granny 2",img:"images/Granny 2.png",url:"games/Granny 2/index.html",cat:"all"},
{title:"Gunfest",img:"images/Gunfest.png",url:"games/Gunfest/index.html",cat:"all"},
{title:"Gunspin",img:"images/Gunspin.png",url:"games/Gunspin/index.html",cat:"all"},
{title:"Half Life",img:"images/Half Life.png",url:"games/Half Life/index.html",cat:"all"},
{title:"Henry Stickman Breaking The Bank",img:"images/Breaking The Bank.png",url:"games/Henry Stickman Breaking The Bank/index.html",cat:"all"},
{title:"Henry Stickman Escaping The Prison",img:"images/Henry Stickman Escaping The Prison.png",url:"games/Henry Stickman Escaping The Prison/index.html",cat:"all"},
{title:"Henry Stickman Stealing The Diamond",img:"images/Henry Stickman Stealing The Diamond.png",url:"games/Henry Stickman Stealing The Diamond/index.html",cat:"all"},
{title:"High Stakes",img:"images/High Stakes.png",url:"games/High Stakes/index.html",cat:"all"},
{title:"Hobo 1",img:"images/Hobo 1.png",url:"games/Hobo 1/index.html",cat:"all"},
{title:"Hobo 2 Prison Brawl",img:"images/Hobo 2.png",url:"games/Hobo 2 Prison Brawl/index.html",cat:"all"},
{title:"Hobo 3 Wanted",img:"images/Hobo 3.png",url:"games/Hobo 3 Wanted/index.html",cat:"all"},
{title:"Hobo 4 Total War",img:"images/Hobo 4 Total War.png",url:"games/Hobo 4 Total War/index.html",cat:"all"},
{title:"Hobo 5 Space Brawl",img:"images/Hobo 5.png",url:"games/Hobo 5 Space Brawl/index.html",cat:"all"},
{title:"Hobo 6 Hell",img:"images/Hobo 6 Hell.png",url:"games/Hobo 6 Hell/index.html",cat:"all"},
{title:"Hobo 7 Heaven",img:"images/Hobo 7 Heaven.png",url:"games/Hobo 7 Heaven/index.html",cat:"all"},
{title:"House Of Hazards",img:"images/House Of Hazards.png",url:"games/House Of Hazards/index.html",cat:"all"},
{title:"Icy Dodo",img:"images/Icy Dodo.png",url:"games/Icy Dodo/index.html",cat:"all"},
{title:"Idle Football Manager",img:"images/Idle Football Manager.png",url:"games/Idle Football Manager/index.html",cat:"all"},
{title:"Into Space 2",img:"images/Into Space 2.png",url:"games/Into Space 2/index.html",cat:"all"},
{title:"Iron Lung",img:"images/Iron Lung.png",url:"games/Iron Lung/index.html",cat:"all"},
{title:"Jelly Mario",img:"images/Jelly Mario.png",url:"games/Jelly Mario/index.html",cat:"all"},
{title:"Jumbo Mario",img:"images/Jumbo Mario.png",url:"games/Jumbo Mario/index.html",cat:"all"},
{title:"Jumping Shell",img:"images/Jumping Shell.png",url:"games/Jumping Shell/index.html",cat:"all"},
{title:"Kour.io",img:"images/Kour.png",url:"games/Kour.io/index.html",cat:"all"},
{title:"Leader Strike",img:"images/Leader Strike.png",url:"games/Leader Strike/index.html",cat:"all"},
{title:"Learn To Fly",img:"images/Learn To Fly.png",url:"games/Learn To Fly/index.html",cat:"all"},
{title:"Learn To Fly 2",img:"images/Learn To Fly 2.png",url:"games/Learn To Fly 2/index.html",cat:"all"},
{title:"Learn To Fly 3",img:"images/Learn To Fly 3.png",url:"games/Learn To Fly 3/index.html",cat:"all"},
{title:"Lets Surf",img:"images/Lets Surf.png",url:"games/Lets Surf/index.html",cat:"all"},
{title:"Minecraft 1.8.8",img:"images/Minecraft 1.8.8.png",url:"games/Minecraft 1.8.8/index.html",cat:"all"},
{title:"Minecraft 1.12",img:"images/Minecraft 1.12.png",url:"games/Minecraft 1.12/index.html",cat:"all"},
{title:"Minecraft Beta 1.3",img:"images/Minecraft Beta 1.3.png",url:"games/Minecraft Beta 1.3/index.html",cat:"all"},
{title:"Mini Paint",img:"images/Mini Paint.png",url:"games/Mini Paint/index.html",cat:"all"},
{title:"Monster Tracks",img:"images/Monster Tracks.png",url:"games/Monster Tracks/index.html",cat:"all"},
{title:"Moto Maniac 2",img:"images/Moto Maniac 2.png",url:"games/Moto Maniac 2/index.html",cat:"all"},
{title:"Moto X3M",img:"images/Moto X3M.png",url:"games/Moto X3M/index.html",cat:"all"},
{title:"Moto X3M 2",img:"images/Moto X3M 2.png",url:"games/Moto X3M 2/index.html",cat:"all"},
{title:"Moto X3M Pool Party",img:"images/Moto X3M Pool Party.png",url:"games/Moto X3M Pool Party/index.html",cat:"all"},
{title:"Moto X3M Spookyland",img:"images/Moto X3M Spookyland.png",url:"games/Moto X3M Spookyland/index.html",cat:"all"},
{title:"Moving Truck Bounty",img:"images/Moving Truck Bounty.png",url:"games/Moving Truck Bounty/index.html",cat:"all"},
{title:"My Dream Hospital",img:"images/My Dream Hospital.png",url:"games/My Dream Hospital/index.html",cat:"all"},
{title:"Ninja VS EvilCorp",img:"images/Ninja Vs Evilcorp.png",url:"games/Ninja Vs Evilcorp/index.html",cat:"all"},
{title:"OvO",img:"images/OvO.png",url:"games/OvO/index.html",cat:"all"},
{title:"OvO 2",img:"images/OvO 2.png",url:"games/OvO 2/index.html",cat:"all"},
{title:"Papas Bakeria",img:"images/Papas Bakeria.png",url:"games/Papas Bakeria/index.html",cat:"all"},
{title:"Papas Burgeria",img:"images/Papas Burgeria.png",url:"games/Papas Burgeria/index.html",cat:"all"},
{title:"Papas Cheeseria",img:"images/Papas Cheeseria.png",url:"games/Papas Cheeseria/index.html",cat:"all"},
{title:"Papas Cupcakeria",img:"images/Papas Cupcakeria.png",url:"games/Papas Cupcakeria/index.html",cat:"all"},
{title:"Papas Donutria",img:"images/Papas Donuteria.png",url:"games/Papas Donuteria/index.html",cat:"all"},
{title:"Papas Pancakeria",img:"images/Papas Pancakeria.png",url:"games/Papas Pancakeria/index.html",cat:"all"},
{title:"Papas Pastaria",img:"images/Papas Pastaria.png",url:"games/Papas Pastaria/index.html",cat:"all"},
{title:"Papas Scooperia",img:"images/Papas Scooperia.png",url:"games/Papas Scooperia/index.html",cat:"all"},
{title:"Papas Sushiria",img:"images/Papas Sushiria.png",url:"games/Papas Sushiria/index.html",cat:"all"},
{title:"Papas TacoMia",img:"images/Papas TacoMia.png",url:"games/Papas TacoMia/index.html",cat:"all"},
{title:"Papas Wingeria",img:"images/Papas Wingeria.png",url:"games/Papas Wingeria/index.html",cat:"all"},
{title:"Papery Planes",img:"images/Papery Planes.png",url:"games/Papery Planes/index.html",cat:"all"},
{title:"Pixel Gun Survival",img:"images/Pixel Gun Survival.png",url:"games/Pixel Gun Survival/index.html",cat:"all"},
{title:"Polytrack",img:"images/polytrack.jpeg",url:"games/Polytrack/index.html",cat:"all"},
{title:"Rainbow Road Polytrack",img:"images/Rainbow Road Polytrack.png",url:"games/Polytrack but mario/index.html",cat:"all"},
{title:"Ragdoll Hit",img:"images/Ragdoll Hit.png",url:"games/Ragdoll Hit/index.html",cat:"all"},
{title:"Retro Bowl",img:"images/Retro Bowl.png",url:"games/Retro Bowl/index.html",cat:"all"},
{title:"Riddle School",img:"images/Riddle School.png",url:"games/Riddle School/index.html",cat:"all"},
{title:"Riddle School 2",img:"images/Riddle School 2.png",url:"games/Riddle School 2/index.html",cat:"all"},
{title:"Riddle School 3",img:"images/Riddle School 3.png",url:"games/Riddle School 3/index.html",cat:"all"},
{title:"Riddle School 4",img:"images/Riddle School 4.png",url:"games/Riddle School 4/index.html",cat:"all"},
{title:"Riddle School 5",img:"images/Riddle School 5.png",url:"games/Riddle School 5/index.html",cat:"all"},
{title:"Riddle Transfer",img:"images/Riddle Transfer.png",url:"games/Riddle Transfer/index.html",cat:"all"},
{title:"Riddle Transfer 2",img:"images/Riddle Transfer 2.png",url:"games/Riddle Transfer 2/index.html",cat:"all"},
{title:"Rolly Vortex",img:"images/Rolly Vortex.png",url:"games/Rolly Vortex/index.html",cat:"all"},
{title:"Rooftop Snipers 2",img:"images/Rooftop Snipers 2.png",url:"games/Rooftop Snipers 2/index.html",cat:"all"},
{title:"Run 2",img:"images/Run 2.png",url:"games/Run 2/index.html",cat:"all"},
{title:"Sandboxels",img:"images/Sandboxels.png",url:"games/Sandboxels/index.html",cat:"all"},
{title:"Sandtris",img:"images/Sandtris.png",url:"games/Sandtris/index.html",cat:"all"},
{title:"Scrap Metal 3 Infernal Trap",img:"images/Scrap Metal 3.png",url:"games/Scrap Metal 3/index.html",cat:"all"},
{title:"Short Ride",img:"images/Short Ride.png",url:"games/Short Ride/index.html",cat:"all"},
{title:"Silk",img:"images/Silk.png",url:"games/Silk/index.html",cat:"all"},
{title:"Slope Plus",img:"images/Slope Plus.png",url:"games/Slope Plus/index.html",cat:"all"},
{title:"Slow Roads",img:"images/Slow Roads.png",url:"games/Slow Roads/index.html",cat:"all"},
{title:"Snow Rider 3D",img:"images/Snow Rider 3D.png",url:"games/Snow Rider 3D/index.html",cat:"all"},
{title:"Soccer Random",img:"images/Soccer Random.png",url:"games/Soccer Random/index.html",cat:"all"},
{title:"Spacebar Clicker",img:"images/Spacebar Clicker.png",url:"games/Spacebar Clicker/index.html",cat:"all"},
{title:"Station 141",img:"images/Station 141.png",url:"games/Station 141/index.html",cat:"all"},
{title:"Stick Merge",img:"images/Stick Merge.png",url:"games/Stick Merge/index.html",cat:"all"},
{title:"Stickman Hook",img:"images/Stickman Hook.png",url:"games/Stickman Hook/index.html",cat:"all"},
{title:"Subway Surfers",img:"images/Subway Surfers.png",url:"games/Subway Surfers/index.html",cat:"all"},
{title:"Super Mario 64",img:"images/Super Mario 64.png",url:"games/Super Mario 64/index.html",cat:"all"},
{title:"Super Star Car",img:"images/Super Star Car.png",url:"games/Super Star Car/index.html",cat:"all"},
{title:"Supermarket Simulator",img:"images/Supermarket Simulator.png",url:"games/Supermarket Simulator/index.html",cat:"all"},
{title:"Survival Karts",img:"images/Survival Karts.png",url:"games/Survival Karts/index.html",cat:"all"},
{title:"Survival Race",img:"images/Survival Race.png",url:"games/Survival Race/index.html",cat:"all"},
{title:"Tanuki Sunset",img:"images/tanuki sunset.jpg",url:"games/Tanuki Sunset/index.html",cat:"all"},
{title:"Temple Run 2",img:"images/Temple Run 2.png",url:"games/Temple Run 2/index.html",cat:"all"},
{title:"Ten Minutes Till Dawn",img:"images/Ten Minutes Till Dawn.png",url:"games/Ten Minutes Till Dawn/index.html",cat:"all"},
{title:"The Binding Of Issac",img:"images/The Binding Of Issac.png",url:"games/The Binding Of Issac/index.html",cat:"all"},
{title:"The Final Earth 2",img:"images/The Final Earth 2.png",url:"games/The Final Earth 2/index.html",cat:"all"},
{title:"The Impossible Quiz",img:"images/The Impossible Quiz.png",url:"games/The Impossible Quiz/index.html",cat:"all"},
{title:"The Impossible Quiz 2",img:"images/The Impossible Quiz 2.png",url:"games/The Impossible Quiz 2/index.html",cat:"all"},
{title:"There Is No Game",img:"images/There Is No Game.png",url:"games/There Is No Game/index.html",cat:"all"},
{title:"This Is The Only Level",img:"images/This Is The Only Level.png",url:"games/This Is The Only Level/index.html",cat:"all"},
{title:"Thumb Fighter",img:"images/Thumb Fighter.png",url:"games/Thumb Fighter/index.html",cat:"all"},
{title:"Time Shooter 2",img:"images/Time Shooter 2.jpg",url:"games/Time Shooter 2/index.html",cat:"all"},
{title:"Time Shooter 3",img:"images/Time Shooter 3.png",url:"games/Time Shooter 3/index.html",cat:"all"},
{title:"Tiny Fishing",img:"images/Tiny Fishing.png",url:"games/Tiny Fishing/index.html",cat:"all"},
{title:"Tunnel Rush",img:"images/TunnelRush.png",url:"games/TunnelRush/index.html",cat:"all"},
{title:"Ultrakill",img:"images/Ultrakill.png",url:"games/ultrakill/index.html",cat:"all"},
{title:"Undertale Last Breath Bad Time Simulator",img:"images/Undertale Last Breath Bad Time Simulator.png",url:"games/Undertale Last Breath Bad Time Simulator/index.html",cat:"all"},
{title:"Unfair Mario",img:"images/Unfair Mario.png",url:"games/Unfair Mario/index.html",cat:"all"},
{title:"Vex 3",img:"images/Vex 3.png",url:"games/Vex 3/index.html",cat:"all"},
{title:"Vex 4",img:"images/Vex 4.png",url:"games/Vex 4/index.html",cat:"all"},
{title:"Vex 5",img:"images/Vex 5.png",url:"games/Vex 5/index.html",cat:"all"},
{title:"Vex 6",img:"images/Vex 6.png",url:"games/Vex 6/index.html",cat:"all"},
{title:"Vex 8",img:"images/Vex 8.png",url:"games/Vex 8/index.html",cat:"all"},
{title:"Virtual Piano",img:"images/Virtual Piano.png",url:"games/Virtual Piano/index.html",cat:"all"},
{title:"We Become What We Behold",img:"images/We Become What We Behold.png",url:"games/We Become What We Behold/index.html",cat:"all"},
{title:"Wheely 2",img:"images/Wheely 2.png",url:"games/Wheely 2/index.html",cat:"all"},
{title:"Wheely 4",img:"images/Wheely 4.png",url:"games/Wheely 4/index.html",cat:"all"},
{title:"Wordle",img:"images/Wordle.png",url:"games/Wordle/index.html",cat:"all"},
{title:"Worlds Hardest Game",img:"images/Worlds Hardest Game.png",url:"games/Worlds Hardest Game/index.html",cat:"all"},
{title:"Worlds Hardest Game 2",img:"images/Worlds Hardest Game 2.png",url:"games/Worlds Hardest Game 2/index.html",cat:"all"},
{title:"Worlds Hardest Game 3",img:"images/Worlds Hardest Game 3.png",url:"games/Worlds Hardest Game 3/index.html",cat:"all"},
{title:"Worlds Hardest Game 4",img:"images/Worlds Hardest Game 4.png",url:"games/Worlds Hardest Game 4/index.html",cat:"all"},
{title:"xx142-b2.exe",img:"images/xx142-b2.exe.png",url:"games/xx142-b2.exe/index.html",cat:"all"},
{title:"You VS 100 Skibidi",img:"images/You VS 100 Skibidi.png",url:"games/You VS 100 Skibidi/index.html",cat:"all"},
]

const movies=[
{title:"Bee Movie",img:"images/Bee.png",url:"movies/Bee Movie/index.html",cat:"all"},
{title:"Shrek",img:"images/Shrek.png",url:"movies/shrek/index.html",cat:"all"},
{title:"Spiderman Into The Spiderverse",img:"images/Spider Man Into The Spider Verse.png",url:"movies/Spider Man Into The Spider Verse/index.html",cat:"all"},
{title:"The Lego Ninjago Movie",img:"images/ninjago.png",url:"movies/The Lego Ninjago movie/index.html",cat:"all"},
]

function updateTabIndicator(){
const activeBtn = document.querySelector('.tab-btn.active')
const indicator = document.querySelector('.tab-indicator')
if(activeBtn && indicator){
const rect = activeBtn.getBoundingClientRect()
const container = document.querySelector('.tab-container')
const containerRect = container.getBoundingClientRect()
indicator.style.left = (rect.left - containerRect.left) + 'px'
indicator.style.width = rect.width + 'px'
}
}

function updateTabUI(t){
// Update active button
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.tab === t)
})

// Show/hide category bar
const categoryBar = document.getElementById('categoryBar')
if(categoryBar){
  categoryBar.style.display = t === 'games' ? 'block' : 'none'
}

// Reset category buttons
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.classList.toggle('active', btn.textContent.toLowerCase() === 'all')
})

requestAnimationFrame(() => updateTabIndicator())
}

function switchTab(t){
if(tab === t || isSwitchingTab) return
isSwitchingTab = true

updateTabUI(t)

const wrapper = document.querySelector('.content-wrapper')
if(!wrapper){
  tab = t
  cat = 'all'
  render()
  isSwitchingTab = false
  return
}

wrapper.classList.remove('slide-in')
wrapper.classList.add('slide-out')

wrapper.addEventListener('animationend', function handleSlideOut(){
  wrapper.removeEventListener('animationend', handleSlideOut)
  wrapper.classList.remove('slide-out')

  tab = t
  cat = 'all'
  render()

  wrapper.classList.add('slide-in')
  wrapper.addEventListener('animationend', function handleSlideIn(){
    wrapper.removeEventListener('animationend', handleSlideIn)
    wrapper.classList.remove('slide-in')
    isSwitchingTab = false
  })
})
}

function switchCategory(c){
cat = c
// Update active category button
document.querySelectorAll('.category-btn').forEach(btn => {
btn.classList.toggle('active', btn.textContent.toLowerCase() === c)
})
render()
}

function render(){
if(tab==="extras"){
grid.innerHTML=`
<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
<h2 style="color: var(--accent); margin-top: 0;">Extras</h2>
<div style="max-width: 1000px; margin: 40px auto; display: flex; gap: 30px; justify-content: center; flex-wrap: wrap;">
  <div style="background: var(--card); padding: 30px; border-radius: 16px; border: 1px solid rgba(124, 92, 255, 0.2); flex: 1; min-width: 280px;">
    <h3 style="color: var(--accent); margin-top: 0;">Share Your Feedback</h3>
    <a href="https://docs.google.com/document/d/1mFn2eMQwayVZQMeotMlZYchbJbCDto_UTTi0I1FvcwM/edit?usp=sharing" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--accent); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
      Open Google Doc
    </a>
    <p style="color: #a0aec0; font-size: 0.9rem; margin-top: 20px;">Google Doc YAY</p>
  </div>
  <div style="background: var(--card); padding: 30px; border-radius: 16px; border: 1px solid rgba(124, 92, 255, 0.2); flex: 1; min-width: 280px;">
    <h3 style="color: var(--accent); margin-top: 0;">Report Issue</h3>
    <a href="https://forms.gle/iGTWkFvDJjGGeWeN8" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--accent); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
      Open Google Form
    </a>
    <p style="color: #a0aec0; font-size: 0.9rem; margin-top: 20px;">Found a bug? Let me know!</p>
  </div>
</div>
</div>
`
return
}

let list=tab==="games"?games:movies
let s=search.value.toLowerCase()
grid.innerHTML=""
const filtered=list.filter(x=>
x.title.toLowerCase().includes(s)&&
(cat=="all"||x.cat.split(",").includes(cat))
)

// Use DocumentFragment for better performance
const fragment=document.createDocumentFragment()
let cardIndex=0
filtered.forEach(x=>{
const card=document.createElement("div")
card.className="grid-item"
card.style.setProperty('--card-index', cardIndex++)
card.onclick=()=>openGame(x.url)

const img=document.createElement("img")
img.src=""
img.dataset.src=x.img
img.loading="lazy"
img.alt=x.title

const overlay=document.createElement("div")
overlay.className="overlay"
overlay.innerHTML=`<b>${x.title}</b>`

card.appendChild(img)
card.appendChild(overlay)
fragment.appendChild(card)
})

grid.appendChild(fragment)

// Initialize lazy loading for images
initializeLazyLoading()
}

// Lazy Loading with Intersection Observer
function loadImageWithTimeout(img, src, title) {
    img.src = src;
}

function handleImageTimeout(img, title) {
    const card = img.parentElement;
    if (!card) return;
    img.remove();
    if (card.querySelector('.no-img')) return;
    const text = document.createElement('div');
    text.className = 'no-img';
    text.textContent = title;
    card.insertBefore(text, card.firstChild);
}

function initializeLazyLoading(){
    if('IntersectionObserver' in window){
        const imageObserver=new IntersectionObserver((entries,observer)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    const img=entry.target
                    if(img.dataset.src){
                        loadImageWithTimeout(img, img.dataset.src, img.alt);
                        img.removeAttribute('data-src')
                        observer.unobserve(img)
                    }
                }
            })
        })
        const lazyImages=grid.querySelectorAll('img[data-src]')
        lazyImages.forEach(img=>imageObserver.observe(img))
    }else{
        const lazyImages=grid.querySelectorAll('img[data-src]')
        lazyImages.forEach(img=>{
            loadImageWithTimeout(img, img.dataset.src, img.alt);
            img.removeAttribute('data-src')
        })
    }
}

function updateMuteButton(){
if(!muteBtn) return
muteBtn.textContent=isMuted?"🔇 Unmute":"🔊 Mute"
muteBtn.classList.toggle("active",isMuted)
muteBtn.setAttribute("aria-pressed",String(isMuted))
}

function syncMediaState(doc){
if(!doc) return
const mediaElements=doc.querySelectorAll("audio,video")
mediaElements.forEach(media=>{
media.muted=isMuted
media.defaultMuted=isMuted
})
}

function patchAudioInWindow(win){
if(!win||win.__forksMutePatched) return
win.__forksMutePatched=true
win.__forksAudioContexts=new Set()

try{
const mediaPrototype=win.HTMLMediaElement?.prototype
if(mediaPrototype&&!mediaPrototype.__forksMuteWrapped){
const originalPlay=mediaPrototype.play
mediaPrototype.play=function(...args){
this.muted=isMuted
this.defaultMuted=isMuted
return originalPlay.apply(this,args)
}
mediaPrototype.__forksMuteWrapped=true
}
}catch(e){}

try{
const OriginalAudio=win.Audio
if(typeof OriginalAudio==="function"){
const WrappedAudio=function(...args){
const audio=new OriginalAudio(...args)
audio.muted=isMuted
audio.defaultMuted=isMuted
return audio
}
WrappedAudio.prototype=OriginalAudio.prototype
Object.setPrototypeOf(WrappedAudio,OriginalAudio)
win.Audio=WrappedAudio
}
}catch(e){}

try{
const audioNodePrototype=win.AudioNode?.prototype
if(audioNodePrototype&&!audioNodePrototype.__forksMuteConnectWrapped){
const originalConnect=audioNodePrototype.connect
audioNodePrototype.connect=function(destination,...args){
try{
const ctx=this.context
if(destination===ctx?.destination && ctx.__forksMuteGain){
return originalConnect.call(this,ctx.__forksMuteGain,...args)
}
}catch(e){}
return originalConnect.call(this,destination,...args)
}
audioNodePrototype.__forksMuteConnectWrapped=true
}
}catch(e){}

;["AudioContext","webkitAudioContext"].forEach(name=>{
try{
const OriginalContext=win[name]
if(typeof OriginalContext!=="function") return
const WrappedContext=function(...args){
const ctx=new OriginalContext(...args)
win.__forksAudioContexts.add(ctx)
ensureAudioContextGain(ctx)
return ctx
}
WrappedContext.prototype=OriginalContext.prototype
Object.setPrototypeOf(WrappedContext,OriginalContext)
win[name]=WrappedContext
}catch(e){}
})
}

function collectAudioContexts(win){
if(!win||!win.__forksAudioContexts) return
const contextTypes=[win.AudioContext,win.webkitAudioContext].filter(Boolean)
if(!contextTypes.length) return
const addContext=value=>{
if(!value) return
if(contextTypes.some(ContextType=>value instanceof ContextType)){
win.__forksAudioContexts.add(value)
}
}
try{
Object.values(win).forEach(value=>{
addContext(value)
if(value&&typeof value==="object"){
addContext(value.ctx)
addContext(value.audioContext)
addContext(value.context)
}
})
}catch(e){}
}

function updateLibraryMuteState(win){
try{
win.Howler?.mute?.(isMuted)
}catch(e){}

try{
if(win.createjs?.Sound){
win.createjs.Sound.muted=isMuted
}
}catch(e){}

try{
if(win.game?.sound&&"mute" in win.game.sound){
win.game.sound.mute=isMuted
}
}catch(e){}

try{
const moduleAudioContext=win.Module?.SDL2?.audioContext
if(moduleAudioContext&&win.__forksAudioContexts){
win.__forksAudioContexts.add(moduleAudioContext)
}
}catch(e){}
}

function ensureAudioContextGain(ctx){
if(!ctx||ctx.__forksGainCreated||typeof ctx.createGain!="function"||!ctx.destination) return
try{
const gain=ctx.createGain()
gain.gain.value=isMuted?0:1
gain.connect(ctx.destination)
ctx.__forksMuteGain=gain
ctx.__forksGainCreated=true
}catch(e){}
}

function setAudioContextMute(ctx){
if(!ctx) return
try{
ensureAudioContextGain(ctx)
if(ctx.__forksMuteGain){
const gain=ctx.__forksMuteGain.gain
if(typeof gain.setValueAtTime==="function"){
gain.setValueAtTime(isMuted?0:1,ctx.currentTime)
}else{
gain.value=isMuted?0:1
}
}
if(!isMuted && ctx.state==="suspended"){
ctx.resume?.().catch(()=>{})
}
}catch(e){}
}

function updateAudioContextState(win){
collectAudioContexts(win)
if(!win?.__forksAudioContexts) return
win.__forksAudioContexts.forEach(setAudioContextMute)
}

function applyMuteStateToWindow(win){
if(!win) return
try{
patchAudioInWindow(win)
updateLibraryMuteState(win)
syncMediaState(win.document)
updateAudioContextState(win)
for(let i=0;i<win.frames.length;i++){
applyMuteStateToWindow(win.frames[i])
}
}catch(e){}
}

function applyMuteStateToCurrentGame(){
if(!frame?.contentWindow) return
applyMuteStateToWindow(frame.contentWindow)
}

function toggleMute(){
isMuted=!isMuted
try{
localStorage.setItem("forksNFrogzMuted",String(isMuted))
}catch(e){}
updateMuteButton()
applyMuteStateToWindow(window)
applyMuteStateToCurrentGame()
try{
frame?.focus()
frame?.contentWindow?.focus()
}catch(e){}
}

function openGame(u){
player.style.display="flex"
document.body.classList.add("player-opened")
player.classList.remove("closing")
frame.src=u
requestAnimationFrame(()=>{
player.classList.add("opening")
})
setTimeout(applyMuteStateToCurrentGame, 500)
}

function closeGame(){
player.classList.remove("opening")
player.classList.add("closing")
setTimeout(()=>{
player.style.display="none"
document.body.classList.remove("player-opened")
frame.src=""
player.classList.remove("closing")
},300)
}

function full(){
frame?.requestFullscreen?.()
}

function openInNewTab(){
const gameUrl = frame.src
if(gameUrl){
window.open(gameUrl, '_blank')
}
}

// Toggle secret menu with F6 and add Mac keyboard shortcuts
document.addEventListener("keydown",e=>{
if(e.key==="F6"){
e.preventDefault()
if(secret) secret.style.display=secret.style.display==="block"?"none":"block"
}
if(e.metaKey){
if(e.key==="f"||e.key==="F"){
e.preventDefault()
if(search) search.focus()
}else if(e.key==="1"){
e.preventDefault()
switchTab("games")
}else if(e.key==="2"){
e.preventDefault()
switchTab("movies")
}
}
})

// Handle window resize for tab indicator
window.addEventListener('resize', updateTabIndicator)

// Initialize and render
initializeDOMReferences()
updateTabUI("games")
render()
updateTabIndicator()

// Debounced search input for better performance
const searchInput = document.getElementById('search')
if (searchInput) {
  searchInput.addEventListener('input',()=>{
    clearTimeout(searchTimeout)
    searchTimeout=setTimeout(()=>render(),250)
  })
}

// Clear search when logo is clicked
const navbarTitle = document.querySelector('.navbar-title')
if (navbarTitle) {
  navbarTitle.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = ''
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => render(), 250)
    }
  })
}
