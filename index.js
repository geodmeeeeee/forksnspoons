let tab="games"
let previousTab="games"
let cat="all"
let searchTimeout

// Cache DOM elements for better performance
let grid,filterMenu,search,frame,player,secret,tooltip,openingPage,mainContent

function initializeDOMReferences(){
grid=document.getElementById("grid")
filterMenu=document.getElementById("filterMenu")
search=document.getElementById("search")
frame=document.getElementById("frame")
player=document.getElementById("player")
secret=document.getElementById("secret")
userCountDisplay=document.getElementById("userCount")
tooltip=document.getElementById("tooltip")
openingPage=document.getElementById("openingPage")
mainContent=document.getElementById("mainContent")
}

// Navigation functions
function goToHome(){
openingPage.style.display="flex"
mainContent.classList.add("hidden")
player.style.display="none"
}

function goToTab(tabName){
openingPage.style.display="none"
mainContent.classList.remove("hidden")
switchTab(tabName)
}

const gameCategories=["all","sports","multiplayer","platformer","puzzle"]
const movieCategories=["all","comedy","horror","sci-fi"]

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
{title:"1 on 1 Soccar",img:"images/1 on 1 Soccar.png",url:"games/1 on 1 Soccar/index.html",cat:"sports,multiplayer"},
{title:"1 on 1 Tennis",img:"images/1 on 1 Tennis.png",url:"games/1 on 1 Tennis/index.html",cat:"sports"},       
{title:"1v1.lol",img:"images/1v1.lol.png",url:"games/1v1.lol/index.html",cat:"shooter"},
{title:"2 Minute Football",img:"images/2 minute football.png",url:"games/2 minute football/index.html",cat:"sports"},
{title:"3 Pandas",img:"images/3 Pandas.png",url:"games/3 Pandas/index.html",cat:"puzzle"},
{title:"3Dash",img:"images/3Dash.png",url:"games/3Dash/index.html",cat:"platformer"},
{title:"12 Mini Battles",img:"images/12 Mini Battles.png",url:"games/12 Mini Battles/index.html",cat:"multiplayer"},
{title:"60 Seconds Burger Run",img:"images/60 Seconds Burger Run.png",url:"games/60 Seconds Burger Run/index.html",cat:"platformer"},
{title:"99Balls",img:"images/99Balls.png",url:"games/99Balls/index.html",cat:"strategy"},
{title:"A Small World Cup",img:"images/A Small World Cup.png",url:"games/A Small World Cup/index.html",cat:"sports"},
{title:"Achievement Unlocked",img:"images/Achievement Unlocked.png",url:"games/Achievement Unlocked/index.html",cat:"platformer"},
{title:"Achievement Unlocked 2",img:"images/Achievement Unlocked 2.png",url:"games/Achievement Unlocked 2/index.html",cat:"platformer"},
{title:"Achievement Unlocked 3",img:"images/Achievement Unlocked 3.png",url:"games/Achievement Unlocked 3/index.html",cat:"platformer"},
{title:"Adventure Capitalist",img:"images/Adventure Capitalist.png",url:"games/Adventure Capitalist/index.html",cat:"all"},
{title:"Agar.io Lite",img:"images/Agar.io Lite.png",url:"games/Agar.io Lite/index.html",cat:"all"},
{title:"Age of War",img:"images/Age of War.png",url:"games/Age of War/index.html",cat:"all"},
{title:"Age of War 2",img:"images/Age of War 2.png",url:"games/Age of War 2/index.html",cat:"all"},
{title:"Among Us",img:"images/Amongus.png",url:"games/Amongus/index.html",cat:"all"},
{title:"Apple Worm",img:"images/Apple Worm.png",url:"games/Apple Worm/index.html",cat:"all"},
{title:"Awesome Tanks 2",img:"images/Awesome Tanks 2.png",url:"games/Awesome Tanks 2/index.html",cat:"all"},
{title:"Bad Ice Cream",img:"images/Bad Ice Cream.png",url:"games/Bad Ice Cream/index.html",cat:"all"},
{title:"Bad Monday Simulator",img:"images/Bad Monday Simulator.png",url:"games/Bad Monday Simulator/index.html",cat:"all"},
{title:"Baseball Bros",img:"images/BaseBall Bros.png",url:"games/BaseBall Bros/index.html",cat:"all"},
{title:"Basket Random",img:"images/Basket Random.png",url:"games/Basket Random/index.html",cat:"all"},
{title:"Bendy And The Ink Machine",img:"images/Bendy And The Ink Machine.png",url:"games/Bendy And The Ink Machine/index.html",cat:"all"},
{title:"Bad Time Simulator",img:"images/Sans.jpeg",url:"games/Bad Time Simulator/index.html",cat:"all"},
{title:"Bitlife",img:"images/Bitlife.png",url:"games/Bitlife/index.html",cat:"all"},
{title:"BitPlanes",img:"images/BitPlanes.png",url:"games/BitPlanes/index.html",cat:"all"},
{title:"Bloxorz",img:"images/Bloxorz.png",url:"games/Bloxorz/index.html",cat:"all"},
{title:"Bridge Race",img:"images/Bridge Race.png",url:"games/Bridge Race/index.html",cat:"all"},
{title:"Brotato",img:"images/Brotato.png",url:"games/Brotato/index.html",cat:"all"},
{title:"Buckshot Roulette",img:"images/Buckshot Roulette.png",url:"games/Brotato/index.html",cat:"all"},
{title:"Burgen Truck 201X",img:"images/Burgen Truck 201x.png",url:"games/Burgen Truck 201X/index.html",cat:"all"},
{title:"Call Of Duty Black Ops",img:"images/Call Of Duty Black Ops.png",url:"games/Call Of Duty Black Ops/index.html",cat:"all"},
{title:"Candy Crush",img:"images/Candy Crush.png",url:"games/Candy Crush/index.html",cat:"all"},
{title:"CapyBara Clicker",img:"images/CapyBara Clicker.png",url:"games/CapyBara Clicker/index.html",cat:"all"},
{title:"Celeste",img:"images/Celeste.jpeg",url:"games/Celeste/index.html",cat:"all"},
{title:"Cluster Rush",img:"images/Cluster Rush.png",url:"games/Cluster Rush/index.html",cat:"all"},
{title:"Color Water Sort 3D",img:"images/Color Water Sort 3D.jpeg",url:"games/Color Water Sort 3D/index.html",cat:"all"},
{title:"Core Ball",img:"images/Core Ball.png",url:"games/Core Ball/index.html",cat:"all"},
{title:"Countmaster Stickman Games",img:"images/Countmaster Stickman Games.png",url:"games/Countmaster stickman games/index.html",cat:"all"},
{title:"Crazy Cattle 3D",img:"images/Crazy Cattle 3D.png",url:"games/Crazy Cattle 3D/index.html",cat:"all"},
{title:"CS GO clicker",img:"images/CS GO clicker.png",url:"games/CS GO clicker/index.html",cat:"all"},
{title:"CupHead",img:"images/CupHead.png",url:"games/CupHead/index.html",cat:"all"},
{title:"Dad N Me",img:"images/Dad n Me.png",url:"games/Dad N me/index.html",cat:"all"},
{title:"Death Run 3D",img:"images/Death Run 3D.png",url:"games/Death Run 3D/index.html",cat:"all"},
{title:"Deltarune",img:"images/Deltarune.png",url:"games/Deltarune/index.html",cat:"all"},
{title:"Doblox",img:"images/Doblox.png",url:"games/Doblox/index.html",cat:"multiplayer"},
{title:"Doge Miner",img:"images/Doge Miner.png",url:"games/Doge Miner/index.html",cat:"all"},
{title:"Doge Miner 2",img:"images/Doge Miner 2.png",url:"games/Doge Miner 2/index.html",cat:"all"},
{title:"Donkey Kong 64",img:"images/Donkey Kong 64.png",url:"games/Donkey Kong 64/index.html",cat:"all"},
{title:"Doom",img:"images/Doom.png",url:"games/Doom/index.html",cat:"shooter"},
{title:"Doom 64",img:"images/Doom 64.png",url:"games/Doom 64/index.html",cat:"shooter"},
{title:"Douchebag Life",img:"images/DBL.png",url:"games/Douchebag life/index.html",cat:"all"},
{title:"Dragon Ball Z legacy of goku",img:"images/Dragon Ball Z legacy of goku.png",url:"games/Dragon Ball Z legacy of goku/index.html",cat:"all"},
{title:"Draw Climber",img:"images/Draw Climber.png",url:"games/Draw Climber/index.html",cat:"all"},
{title:"Drift Boss",img:"images/Drift Boss.png",url:"games/Drift Boss/index.html",cat:"all"},
{title:"Drift Hunters",img:"images/Drift Hunters.png",url:"games/Drift Hunters/index.html",cat:"all"},
{title:"Drive Mad",img:"images/Drive Mad.png",url:"games/Drive Mad/index.html",cat:"all"},
{title:"Eagle Ride",img:"images/eagle ride.png",url:"games/Eagle Ride/index.html",cat:"all"},
{title:"EarthBound",img:"images/EarthBound.png",url:"games/EarthBound/index.html",cat:"all"},
{title:"Elastic Face",img:"images/Elastic Face.png",url:"games/Elastic Face/index.html",cat:"all"},
{title:"Escape Road",img:"images/Escape road.png",url:"games/Escape Road/index.html",cat:"all"},
{title:"Escape Road 2",img:"images/escape road 2.jpeg",url:"games/Escape Road 2/index.html",cat:"all"},
{title:"Five Nights At Epsteins",img:"images/Five Nights At Epsteins.png",url:"games/Five Nights At Epsteins/index.html",cat:"all"},
{title:"Five Nights at Freddys",img:"images/five nights at freddys.png",url:"games/Five Nights at Freddys/index.html",cat:"all"},
{title:"Five Nights at Freddys 2",img:"images/five nights at freddys 2.png",url:"games/Five Nights at Freddys 2/index.html",cat:"all"},
{title:"Five Nights at Freddys 3",img:"images/five nights at freddys 3.png",url:"games/Five Nights at Freddys 3/index.html",cat:"all"},
{title:"Portal The Flash Verison",img:"images/Flash Portal.png",url:"games/Flash Portal/index.html",cat:"all"},
{title:"Fluidism",img:"images/Fluidism.png",url:"games/Fluidism/index.html",cat:"all"},
{title:"Fortzone",img:"images/Fortzone.png",url:"games/Fortzone/index.html",cat:"all"},
{title:"Friday Night Funkin",img:"images/Friday Night Funkin.png",url:"games/friday night funkin/index.html",cat:"all"},
{title:"Fruit Ninja",img:"images/Fruit Ninja.png",url:"games/Fruit Ninja/index.html",cat:"all"},
{title:"Gangsta Bean",img:"images/Gangsta Bean.png",url:"games/Gangsta Bean/index.html",cat:"all"},
{title:"Geometry Dash",img:"images/Geometry dash.png",url:"games/Geometry Dash/index.html",cat:"all"},
{title:"Geometry Vibes",img:"images/Geometry Vibes.png",url:"games/Geometry Vibe/index.html",cat:"all"},
{title:"Getting Over It",img:"images/Getting Over It.png",url:"games/Getting Over It/index.html",cat:"all"},
{title:"Gimme The Airpod",img:"images/Gimme The Airpod.png",url:"games/Gimme The Airpod/index.html",cat:"all"},
{title:"Gladihoppers",img:"images/Gladihoppers.png",url:"games/Gladihoppers/index.html",cat:"all"},
{title:"Glover",img:"images/Glover.png",url:"games/Glover/index.html",cat:"all"},
{title:"Gold Digger FRVR",img:"images/Gold Digger FRVR.png",url:"games/Gold Digger FRVR/index.html",cat:"all"},
{title:"Golden eye 007",img:"images/Golden Eye 007.png",url:"games/Golden Eye 007/index.html",cat:"all"},
{title:"Google Dino",img:"images/Google Dino.png",url:"games/Google Dino/index.html",cat:"all"},
{title:"Grand Theft Auto",img:"images/grand theft auto.png",url:"games/Grand Theft Auto/index.html",cat:"all"},
{title:"Grand Theft Auto 2",img:"images/GTA2.png",url:"games/Grand Theft Auto 2/index.html",cat:"all"},
{title:"Grand Theft Auto Vice City",img:"images/grand theft auto vice city.png",url:"games/grand theft auto vice city/index.html",cat:"all"},
{title:"Granny",img:"images/Granny.png",url:"games/Granny/index.html",cat:"all"},
{title:"Growden",img:"images/Grow a Garden.png",url:"games/Grow A Garden/index.html",cat:"all"},
{title:"Half Life",img:"images/Half Life.png",url:"games/Half Life/index.html",cat:"all"},
{title:"Handshakes",img:"images/Handshakes.png",url:"games/Handshakes/index.html",cat:"all"},
{title:"Happy Wheels",img:"images/Happy Wheels.png",url:"games/Happy Wheels/index.html",cat:"all"},
{title:"High Stakes",img:"images/High Stakes.png",url:"games/High Stakes/index.html",cat:"all"},
{title:"Highway Racer",img:"images/Highway Racer.png",url:"games/highway racer/index.html",cat:"all"},
{title:"Hollow Knight",img:"images/Hollow Knight.png",url:"games/Hollow Knight/index.html",cat:"all"},
{title:"Hollow Knight Silksong Demake",img:"images/Hollow Knight Silksong Demake.png",url:"games/Hollow Knight Silksong Demake/index.html",cat:"all"},
{title:"Ice Dodo",img:"images/Icy Dodo.png",url:"games/Icy Dodo/index.html",cat:"all"},
{title:"Icey Purple Head",img:"images/Icy Purple Head.png",url:"games/Icy Purple Head/index.html",cat:"all"},
{title:"Ink Games",img:"images/Ink Games.png",url:"games/Ink Games/index.html",cat:"all"},
{title:"Iron Lung",img:"images/Iron Lung.png",url:"games/Iron Lung/index.html",cat:"all"},
{title:"Johnny Trigger",img:"images/Johnny Trigger.jpeg",url:"games/Johnny Trigger/index.html",cat:"all"},
{title:"Just Hit The Button",img:"images/Just Hit The Button.png",url:"games/Just Hit The Button/index.html",cat:"all"},
{title:"Karlson",img:"images/Karlson.png",url:"games/Karlson/index.html",cat:"platformer,shooter"},
{title:"Kirby 64",img:"images/Kirby 64.png",url:"games/Kirby 64/index.html",cat:"all"},
{title:"Kour.io",img:"images/Kourio.png",url:"games/Kour.io/index.html",cat:"all"},
{title:"Lego Indiana Jones The Original Adventures",img:"images/Lego Indiana Jones.png",url:"games/Lego Indiana Jones/index.html",cat:"all"},
{title:"Lucky Blocks Obby",img:"images/Lucky Blocks Obby.png",url:"games/Lucky Blocks Obby/index.html",cat:"all"},
{title:"Mario Kart 64",img:"images/Mario Kart 64.png",url:"games/Mario Kart 64/index.html",cat:"all"},
{title:"Mario Kart DS",img:"images/Mario Kart DS.png",url:"games/Mario Kart DS/index.html",cat:"all"},
{title:"Mario Kart Super Circuit",img:"images/Mario Kart Super Circuit.png",url:"games/Mario Kart Super Circuit/index.html",cat:"all"},
{title:"Mario Party",img:"images/Mario Party.png",url:"games/Mario Party/index.html",cat:"all"},
{title:"Mario Party 2",img:"images/Mario Party 2.png",url:"games/Mario Party 2/index.html",cat:"all"},
{title:"Mario Tennis",img:"images/Mario Tennis.png",url:"games/Mario Tennis/index.html",cat:"all"},
{title:"Minecraft 1.8.8",img:"images/Minecraft 1.8.8.png",url:"games/Minecraft 1.8.8/index.html",cat:"all"},
{title:"Minecraft 1.12",img:"images/Minecraft 1.12.png",url:"games/Minecraft 1.12/index.html",cat:"all"},
{title:"Minecraft Beta 1.3",img:"images/Minecraft Beta 1.3.png",url:"games/Minecraft Beta 1.3/index.html",cat:"all"},
{title:"Monkey Mart",img:"images/Monkey Mart.png",url:"games/Monkey Mart/index.html",cat:"all"},
{title:"Newgrounds Rumble",img:"images/Newgrounds Rumble.png",url:"games/Newgrounds Rumble/index.html",cat:"all"},
{title:"Nubbys Number Factory",img:"images/Nubbys Number Factory.png",url:"games/Nubbys Number Factory/index.html",cat:"all"},
{title:"Obby 99% Will Lose",img:"images/obby99%willlose.png",url:"games/Obby 99% Will Lose/index.html",cat:"all"},
{title:"The Oregon Trail",img:"images/Oregon Trail.png",url:"games/Oregon Trail/index.html",cat:"all"},
{title:"OvO",img:"images/OvO.png",url:"games/OvO/index.html",cat:"all"},
{title:"Papas Pizzeria",img:"images/Papaz Pizzeria.png",url:"games/Papas Pizzeria/index.html",cat:"all"},
{title:"Parking Fury",img:"images/Parking Fury.png",url:"games/Parking Fury/index.html",cat:"all"},
{title:"Peggle",img:"images/Peggle.png",url:"games/Peggle/index.html",cat:"all"},
{title:"Pixel Speedrun",img:"images/Pixel Speedrun.png",url:"games/Pixel Speedrun/index.html",cat:"all"},
{title:"Plinko",img:"images/Plinko.png",url:"games/Plinko/index.html",cat:"all"},
{title:"Pokemon Blue",img:"images/Pokemon Blue.png",url:"games/Pokemon Blue/index.html",cat:"all"},
{title:"Pokemon Emerald",img:"images/Pokemon Emerald.png",url:"games/Pokemon Emerald/index.html",cat:"all"},
{title:"Pokemon Red",img:"images/Pokemon Red.png",url:"games/Pokemon Red (GBA)/index.html",cat:"all"},
{title:"Polytrack",img:"images/polytrack.jpeg",url:"games/Polytrack/index.html",cat:"all"},
{title:"R.E.P.O",img:"images/REPO.png",url:"games/R.E.P.O/index.html",cat:"all"},
{title:"Ragdoll Archers",img:"images/Ragdoll Archers.png",url:"games/Ragdoll Archers/index.html",cat:"all"},
{title:"Retro Bowl",img:"images/retro bowl.jpeg",url:"games/Retro Bowl/index.html",cat:"all"},
{title:"Silk",img:"images/Silk.png",url:"games/Silk/index.html",cat:"all"},
{title:"Slope 2 Player",img:"images/Slope 2 Player.png",url:"games/Slope 2 Player/index.html",cat:"all"},
{title:"Slope Plus",img:"images/Slope Plus.png",url:"games/Slope Plus/index.html",cat:"all"},
{title:"Smash Karts",img:"images/Smash Karts.jpg",url:"games/Smash Karts/index.html",cat:"all"},
{title:"Snow Rider 3D",img:"images/Snow Rider 3D.png",url:"games/Snow Rider 3D/index.html",cat:"all"},
{title:"Sonic CD",img:"images/Sonic CD.png",url:"games/Sonic CD/index.html",cat:"all"},
{title:"Sonic The Hedgehog",img:"images/Sonic The Hedgehog.png",url:"games/Sonic The Hedgehog/index.html",cat:"all"},
{title:"Space Waves",img:"images/Space Waves.png",url:"games/Space Waves/index.html",cat:"all"},
{title:"Spacebar Clicker",img:"images/Spacebar Clicker.png",url:"games/Spacebar Clicker/index.html",cat:"all"},
{title:"Star Fox 64",img:"images/Star Fox 64.png",url:"games/Star Fox 64/index.html",cat:"all"},
{title:"Steal a Brainrot",img:"images/Steal a Brainrot.png",url:"games/Steal a Brainrot/index.html",cat:"all"},
{title:"Stickman Hook",img:"images/Stickman Hook.png",url:"games/Stickman Hook/index.html",cat:"all"},
{title:"Stone Grass Mowing Simulator",img:"images/Stone Grass Mowing Simulator.png",url:"games/Stone Grass Mowing Simulator/index.html",cat:"all"},
{title:"Sugar Sugar",img:"images/Sugar Sugar.png",url:"games/Sugar Sugar/index.html",cat:"all"},
{title:"Super Mario 64",img:"images/mayrio.jpeg",url:"games/Super Mario 64/index.html",cat:"all"},
{title:"Super Mario World",img:"images/Super Mario World.png",url:"games/Super Mario World/index.html",cat:"all"},
{title:"Super Smash Bros",img:"images/super smash bros.jpg",url:"games/Super Smash Bros/index.html",cat:"all"},
{title:"Super Smash Flash 2",img:"images/Super smash flash 2.png",url:"games/Super Smash Flash 2/index.html",cat:"all"},
{title:"SuperCold",img:"images/SuperCold.png",url:"games/SuperCold/index.html",cat:"all"},
{title:"SuperHot",img:"images/superhot.jpeg",url:"games/SuperHot/index.html",cat:"all"},
{title:"Tag",img:"images/Tag.png",url:"games/Tag/index.html",cat:"all"},
{title:"Tanuki Sunset",img:"images/tanuki sunset.jpg",url:"games/Tanuki Sunset/index.html",cat:"all"},
{title:"Temple Run 2",img:"images/Temple Run 2.png",url:"games/Temple Run 2/index.html",cat:"all"},
{title:"Ten Minutes Till Dawn",img:"images/Ten Minutes Till Dawn.png",url:"games/Ten Minutes Till Dawn/index.html",cat:"all"},
{title:"The Binding Of Issac",img:"images/BOI.png",url:"games/The Binding Of Issac/index.html",cat:"all"},
{title:"The Impossible Quiz",img:"images/The Impossible Quiz.jpeg",url:"games/The Impossible Quiz/index.html",cat:"all"},
{title:"The Impossible Quiz 2",img:"images/The Impossible Quiz 2.png",url:"games/The Impossible Quiz 2/index.html",cat:"all"},
{title:"Time Shooter 2",img:"images/Time Shooter 2.jpg",url:"games/Time Shooter 2/index.html",cat:"all"},
{title:"Time Shooter 3",img:"images/time shooter 3.jpg",url:"games/Time Shooter 3/index.html",cat:"all"},
{title:"Tunnel Rush",img:"images/Tunnel Rush.png",url:"games/Tunnel Rush/index.html",cat:"all"},
{title:"Tom Clancys Rainbow Six",img:"images/Tom Clancys Rainbow Six.png",url:"games/Tom Clancys Rainbow Six/index.html",cat:"all"},
{title:"Ultrakill",img:"images/Ultrakill.png",url:"games/ultrakill/index.html",cat:"all"},
{title:"Undertale Yellow",img:"images/Undertale Yellow.png",url:"games/Undertale Yellow/index.html",cat:"all"},
{title:"Untitled Goose Game",img:"images/Untitled Goose Game.png",url:"games/Untitled Goose Game/index.html",cat:"all"},
{title:"Vex 4",img:"images/Vex 4.png",url:"games/Vex 4/index.html",cat:"all"},
{title:"Vex 6",img:"images/Vex 6.png",url:"games/Vex 6/index.html",cat:"all"},
{title:"Vex 7",img:"images/Vex 7.png",url:"games/Vex 7/index.html",cat:"all"},
{title:"Wave Race 64",img:"images/Wave Race 64.png",url:"games/Wave Race 64/index.html",cat:"all"},
{title:"We Become What We Behold",img:"images/We Become What We Behold.png",url:"games/We Become What We Behold/index.html",cat:"all"},
{title:"Web Fishing",img:"images/Web Fishing.png",url:"games/Web Fishing/index.html",cat:"all"},
{title:"Worlds Hardest Game",img:"images/Worlds Hardest Game.png",url:"games/Worlds Hardest Game/index.html",cat:"all"},
{title:"You VS 100 Skibidi Toilets",img:"images/you vs 100 skibidi.png",url:"games/You vs 100 Skibidi/index.html",cat:"all"}
]

const movies=[
{title:"Movie 1",img:"images/movie1.png",url:"movies/m1.html",cat:"comedy"}
]

function switchTab(t){
previousTab=tab
tab=t
cat="all"
const credits=document.getElementById("credits")
if(t==="movies"){
credits.classList.add("show")
}else{
credits.classList.remove("show")
}

if(t!=="extras"){
loadCategories()
}else{
filterMenu.innerHTML=""
}

render()
}

function loadCategories(){
let cats=tab=="games"?gameCategories:movieCategories
filterMenu.innerHTML=""
cats.forEach(c=>{
filterMenu.innerHTML+=`
<div class="filter-option"
onclick="setCat('${c}')">
${c}
</div>`
})
}

function toggleFilter(){
filterMenu.classList.toggle("show")
}

function setCat(c){
cat=c
render()
toggleFilter()
}

function render(){
if(tab==="extras"){
grid.innerHTML=`
<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
<h2 style="color: var(--accent); margin-top: 0;">Coming Soon!</h2>
<p style="color: var(--text); font-size: 1.1rem;">chances i add anything here are near zero</p>
<p style="color: #a0aec0;">Check back soon tho i might change my mind</p>
</div>
`
return
}

let list=tab=="games"?games:movies
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
card.className="card"
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

    // remove the broken/in-progress image
    img.remove();

    // if we've already inserted a text fallback, don't duplicate
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
                        // use our new loader with timeout
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
        // Fallback for browsers without IntersectionObserver
        const lazyImages=grid.querySelectorAll('img[data-src]')
        lazyImages.forEach(img=>{
            loadImageWithTimeout(img, img.dataset.src, img.alt);
            img.removeAttribute('data-src')
        })
    }
}

function openGame(u){
player.style.display="flex"
player.classList.remove("closing")
frame.src=u
// Trigger animation on next frame to ensure display:flex is applied first
requestAnimationFrame(()=>{
player.classList.add("opening")
})
}

function closeGame(){
player.classList.remove("opening")
player.classList.add("closing")
// Wait for animation to complete before hiding
setTimeout(()=>{
player.style.display="none"
frame.src=""
player.classList.remove("closing")
},300)
}

function full(){
frame.requestFullscreen()
}



// Toggle secret menu with F6 and add Mac keyboard shortcuts
document.addEventListener("keydown",e=>{
if(e.key==="F6"){
e.preventDefault()
if(secret) secret.style.display=secret.style.display==="block"?"none":"block"
}
// Mac-specific keyboard shortcuts
if(e.metaKey){
if(e.key==="f"||e.key==="F"){
// Cmd+F - Focus search
e.preventDefault()
if(search) search.focus()
}else if(e.key==="1"){
// Cmd+1 - Switch to games
e.preventDefault()
switchTab("games")
}else if(e.key==="2"){
// Cmd+2 - Switch to movies
e.preventDefault()
switchTab("movies")
}
}
})

// Initialize and render
initializeDOMReferences()
loadCategories()
render()

// Debounced search input for better performance
document.getElementById('search').addEventListener('input',()=>{
clearTimeout(searchTimeout)
searchTimeout=setTimeout(()=>render(),250)
})