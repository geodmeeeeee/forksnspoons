let tab="games"
let previousTab="games"
let cat="all"
let searchTimeout
let performanceMode=false
let fpsCounterActive=false
let frameCount=0
let lastTime=performance.now()
let fps=0

// Cache DOM elements for better performance
let grid,filterMenu,search,frame,player,secret,gamesTab,moviesTab,fpsValue,tooltip

function initializeDOMReferences(){
grid=document.getElementById("grid")
filterMenu=document.getElementById("filterMenu")
search=document.getElementById("search")
frame=document.getElementById("frame")
player=document.getElementById("player")
secret=document.getElementById("secret")
gamesTab=document.getElementById("gamesTab")
moviesTab=document.getElementById("moviesTab")
fpsValue=document.getElementById("fps-value")
userCountDisplay=document.getElementById("userCount")
tooltip=document.getElementById("tooltip")
}

const gameCategories=["all","puzzle","fighting","shooter","driving","platformer","sports","horror","multiplayer","sandbox","rhythm","simulator","runner","clicker","rpg","survival","open world"]
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
{title:"1v1.lol",img:"images/1v1.lol.png",url:"games/1v1.lol/index.html",cat:"shooter"},
{title:"2 minute football",img:"images/2 minute football.png",url:"games/2 minute football/index.html",cat:"sports"},
{title:"3Dash",img:"images/3Dash.png",url:"games/3Dash/index.html",cat:"rhythm"},
{title:"Age of War",img:"images/Age of War.png",url:"games/Age of War/index.html",cat:"strategy"},
{title:"Apple Worm",img:"images/Apple Worm.png",url:"games/Apple Worm/index.html",cat:"puzzle"},
{title:"Bad Monday Simulator",img:"images/Bad Monday Simulator.png",url:"games/Bad Monday Simulator/index.html",cat:"fighting"},
{title:"Baseball Bros",img:"images/BaseBall Bros.png",url:"games/BaseBall Bros/index.html",cat:"sports"},
{title:"Bad Time Simulator",img:"images/Sans.jpeg",url:"games/Bad Time Simulator/index.html",cat:"fighting"},
{title:"Bitlife",img:"images/Bitlife.png",url:"games/Bitlife/index.html",cat:"simulator"},
{title:"Bridge Race",img:"images/Bridge Race.png",url:"games/Bridge Race/index.html",cat:"runner"},
{title:"Build Now.gg",img:"images/Build Nowgg.png",url:"games/Build Now.gg/index.html",cat:"shooter"},
{title:"Burgen Truck 201X",img:"images/Burgen Truck 201x.png",url:"games/Burgen Truck 201X/index.html",cat:"driving"},
{title:"Call Of Duty Black Ops",img:"images/Call Of Duty Black Ops.png",url:"games/Call Of Duty Black Ops/index.html",cat:"shooter"},
{title:"Candy Crush",img:"images/Candy Crush.png",url:"games/Candy Crush/index.html",cat:"puzzle"},
{title:"Celeste",img:"images/Celeste.jpeg",url:"games/Celeste/index.html",cat:"platformer"},
{title:"Countmaster Stickman Games",img:"images/Countmaster Stickman Games.png",url:"games/Countmaster stickman games/index.html",cat:"runner"},
{title:"Doge Miner",img:"images/Doge Miner.png",url:"games/Doge Miner/index.html",cat:"Clicker"},
{title:"Doge Miner 2",img:"images/Doge Miner 2.png",url:"games/Doge Miner 2/index.html",cat:"Clicker"},
{title:"Doom 64",img:"images/Doom 64.png",url:"games/Doom 64/index.html",cat:"shooter"},
{title:"Douchebag Life",img:"images/DBL.png",url:"games/Douchebag life/index.html",cat:"simulator"},
{title:"Dragon Ball Z legacy of goku",img:"images/Dragon Ball Z legacy of goku.png",url:"games/Dragon Ball Z legacy of goku/index.html",cat:"rpg"},
{title:"Drive Mad",img:"images/Drive Mad.png",url:"games/Drive Mad/index.html",cat:"driving"},
{title:"Eagle Ride",img:"images/eagle ride.png",url:"games/Eagle Ride/index.html",cat:"runner"},
{title:"Escape Road",img:"images/Escape road.png",url:"games/Escape Road/index.html",cat:"driving"},
{title:"Escape Road 2",img:"images/escape road 2.jpeg",url:"games/Escape Road 2/index.html",cat:"driving"},
{title:"Five Nights at Freddys",img:"images/five nights at freddys.png",url:"games/Five Nights at Freddys/index.html",cat:"horror"},
{title:"Five Nights at Freddys 2",img:"images/five nights at freddys 2.png",url:"games/Five Nights at Freddys 2/index.html",cat:"horror"},
{title:"Five Nights at Freddys 3",img:"images/five nights at freddys 3.png",url:"games/Five Nights at Freddys 3/index.html",cat:"horror"},
{title:"Fortzone",img:"images/Fortzone.png",url:"games/Fortzone/index.html",cat:"shooter"},
{title:"Friday Night Funkin",img:"images/Friday Night Funkin.png",url:"games/friday night funkin/index.html",cat:"rhythm"},
{title:"Geometry Dash",img:"images/Geometry dash.png",url:"games/Geometry Dash/index.html",cat:"rhythm"},
{title:"Gladihoppers",img:"images/Gladihoppers.png",url:"games/Gladihoppers/index.html",cat:"fighting"},
{title:"Golden eye 007",img:"images/Golden Eye 007.png",url:"games/Golden Eye 007/index.html",cat:"shooter"},
{title:"Grand Theft Auto",img:"images/grand theft auto.png",url:"games/Grand Theft Auto/index.html",cat:"shooter,driving,open world"},
{title:"Grand Theft Auto Vice City",img:"images/grand theft auto vice city.png",url:"games/grand theft auto vice city/index.html",cat:"shooter,driving,open world"},
{title:"Half Life",img:"images/Half Life.png",url:"games/Half Life/index.html",cat:"shooter"},
{title:"Highway Racer",img:"images/Highway Racer.png",url:"games/highway racer/index.html",cat:"driving"},
{title:"Hollow Kight",img:"images/Hollow Knight.png",url:"games/Hollow Knight/index.html",cat:"platformer"},
{title:"Karlson",img:"images/Karlson.png",url:"games/Karlson/index.html",cat:"platformer,shooter"},
{title:"Kirby 64",img:"images/Kirby 64.png",url:"games/Kirby 64/index.html",cat:"platformer"},
{title:"Kour.io",img:"images/Kourio.png",url:"games/Kour.io/index.html",cat:"shooter,multiplayer"},
{title:"Mario Kart 64",img:"images/Mario Kart 64.png",url:"games/Mario Kart 64/index.html",cat:"driving"},
{title:"Newgrounds Rumble",img:"images/Newgrounds Rumble.png",url:"games/Newgrounds Rumble/index.html",cat:"fighting"},
{title:"Nubbys Number Factory",img:"images/Nubbys Number Factory.png",url:"games/Nubbys Number Factory/index.html",cat:"puzzle"},
{title:"Peggle",img:"images/peggle.jpg",url:"games/Peggle/index.html",cat:"puzzle"},
{title:"Polytrack",img:"images/polytrack.jpeg",url:"games/Polytrack/index.html",cat:"driving"},
{title:"R.E.P.O",img:"images/REPO.png",url:"games/R.E.P.O/index.html",cat:"horror"},
{title:"Retro Bowl",img:"images/retro bowl.jpeg",url:"games/Retro Bowl/index.html",cat:"sports"},
{title:"Smash Karts",img:"images/Smash Karts.jpg",url:"games/Smash Karts/index.html",cat:"driving,multiplayer"},
{title:"Snow Rider 3D",img:"images/Snow Rider 3D.png",url:"games/Snow Rider 3D/index.html",cat:"driving"},
{title:"Space Waces",img:"images/Space Waves.png",url:"games/Space Waves/index.html",cat:"rythm"},
{title:"Spacebar Clicker",img:"images/Spacebar Clicker.png",url:"games/Spacebar Clicker/index.html",cat:"clicker"},
{title:"Super Mario 64",img:"images/mayrio.jpeg",url:"games/Super Mario 64/index.html",cat:"platformer"},
{title:"Super Smash Bros",img:"images/super smash bros.jpg",url:"games/Super Smash Bros/index.html",cat:"fighting"},
{title:"Super Smash Flash 2",img:"images/Super smash flash 2.png",url:"games/Super Smash Flash 2/index.html",cat:"fighting"},
{title:"SuperHot",img:"images/superhot.jpeg",url:"games/SuperHot/index.html",cat:"shooter"},
{title:"Tanuki Sunset",img:"images/tanuki sunset.jpg",url:"games/Tanuki Sunset/index.html",cat:"driving"},
{title:"The Binding Of Issac",img:"images/BOI.png",url:"games/The Binding Of Issac/index.html",cat:"horror"},
{title:"Time Shooter 2",img:"images/Time Shooter 2.jpg",url:"games/Time Shooter 2/index.html",cat:"shooter"},
{title:"Time Shooter 3",img:"images/time shooter 3.jpg",url:"games/Time Shooter 3/index.html",cat:"shooter"},
{title:"Ultrakill",img:"images/Ultrakill.png",url:"games/ultrakill/index.html",cat:"shooter"},
{title:"We Become What We Behold",img:"images/We Become What We Behold.png",url:"games/We Become What We Behold/index.html",cat:"simulator"},
{title:"You VS 100 Skibidi Toilets",img:"images/you vs 100 skibidi.png",url:"games/You vs 100 Skibidi/index.html",cat:"shooter"}
]

const movies=[
{title:"Movie 1",img:"images/movie1.png",url:"movies/m1.html",cat:"comedy"}
]

function switchTab(t){
previousTab=tab
tab=t
cat="all"
gamesTab.classList.remove("active")
moviesTab.classList.remove("active")
document.getElementById(t+"Tab").classList.add("active")
const credits=document.getElementById("credits")
if(t==="movies"){
credits.classList.add("show")
}else{
credits.classList.remove("show")
}
loadCategories()

// Determine slide direction
const isMovingRight=previousTab==="games"&&t==="movies"
const outClass=isMovingRight?"slide-out-left":"slide-out-right"
const inClass=isMovingRight?"slide-in-right":"slide-in-left"

// Add slide-out animation
grid.classList.add(outClass)

// Wait for animation to complete, then render new content
setTimeout(()=>{
grid.classList.remove(outClass)
grid.classList.add(inClass)
render()
// Remove animation class after it completes
setTimeout(()=>{
grid.classList.remove(inClass)
},400)
},400)
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

function togglePerformanceMode(){
performanceMode=document.getElementById("performanceMode").checked
// Start/stop FPS counter based on performance mode
if(performanceMode&&!fpsCounterActive){
startFPSCounter()
}else if(!performanceMode&&fpsCounterActive){
stopFPSCounter()
}
}

function setCat(c){
cat=c
render()
toggleFilter()
}

function render(){
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
// helper that applies a 5‑second timeout and switches to text on failure
function loadImageWithTimeout(img, src, title) {
    // if performance mode is disabled, just load normally
    if (!performanceMode) {
        img.src = src;
        return;
    }

    // start the timer before assigning src so it can be cancelled by load/error
    const timeoutId = setTimeout(() => {
        // timeout reached, abort loading and show title text
        img.src = '';
        handleImageTimeout(img, title);
    }, 5000); // 5 seconds

    img.addEventListener('load', () => {
        clearTimeout(timeoutId);
    });
    img.addEventListener('error', () => {
        clearTimeout(timeoutId);
        handleImageTimeout(img, title);
    });

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

// FPS Counter - Only runs when performance mode is enabled
let fpsAnimationId=null

function startFPSCounter(){
if(fpsCounterActive) return
fpsCounterActive=true
frameCount=0
lastTime=performance.now()

function updateFPS(){
frameCount++
const currentTime=performance.now()
if(currentTime-lastTime>=1000){
fps=frameCount
frameCount=0
lastTime=currentTime
if(fpsValue) fpsValue.textContent=fps
}
fpsAnimationId=requestAnimationFrame(updateFPS)
}
fpsAnimationId=requestAnimationFrame(updateFPS)
}

function stopFPSCounter(){
if(!fpsCounterActive) return
fpsCounterActive=false
if(fpsAnimationId){
cancelAnimationFrame(fpsAnimationId)
fpsAnimationId=null
}
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