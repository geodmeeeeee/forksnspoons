let tab="games"
let previousTab="games"
let cat="all"
let searchTimeout
let isMuted=false
let isReturningFromBack=false

const splashTexts = [
    "Welcome to Forks N Frogz!",
    "Everythings fucked ik",
    "piracy is fun",
    "try cluster rush",
    "this websites code sucks",
    "movies with help from cortlin",
    "no this isnt hacking",
    "FAHHHHHHH",
    "Microsoft Ruined Github",
    "New UI 2027 guys",
]

try{
isMuted=localStorage.getItem("forksNFrogzMuted")==="true"
}catch(e){}

// Cache DOM elements for better performance
let grid,search,frame,player,secret,tooltip,openingPage,mainContent,muteBtn,siteSubtitle

function initializeDOMReferences(){
grid=document.getElementById("grid")
search=document.getElementById("search")
frame=document.getElementById("frame")
player=document.getElementById("player")
muteBtn=document.getElementById("muteBtn")
secret=document.getElementById("secret")
userCountDisplay=document.getElementById("userCount")
tooltip=document.getElementById("tooltip")
openingPage=document.getElementById("openingPage")
mainContent=document.getElementById("mainContent")
siteSubtitle=document.querySelector(".site-subtitle")
updateMuteButton()
setRandomSplashText()
frame?.addEventListener("load",()=>applyMuteStateToWindow(window))
}

// Navigation functions
function goToHome(){
isReturningFromBack=true
openingPage.style.display="flex"
mainContent.classList.add("hidden")
player.style.display="none"
}

function goToTab(tabName){
isReturningFromBack=false
openingPage.style.display="none"
mainContent.classList.remove("hidden")
switchTab(tabName)
}

const gameCategories=["all","flash","html5"]
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
{title:"2 Minute Football",img:"images/2 minute football.png",url:"games/2 minute football/index.html",cat:"all"},
{title:"99Balls",img:"images/99Balls.png",url:"games/99Balls/index.html",cat:"all"},
{title:"A Small World Cup",img:"images/A Small World Cup.png",url:"games/A Small World Cup/index.html",cat:"all"},
{title:"Agar.io Lite",img:"images/Agar.io Lite.png",url:"games/Agar.io Lite/index.html",cat:"all"},
{title:"Bad Ice Cream",img:"images/Bad Ice Cream.png",url:"games/Bad Ice Cream/index.html",cat:"all"},
{title:"Basket Random",img:"images/Basket Random.png",url:"games/Basket Random/index.html",cat:"all"},
{title:"Bitlife",img:"images/Bitlife.png",url:"games/Bitlife/index.html",cat:"all"},
{title:"BitPlanes",img:"images/BitPlanes.png",url:"games/BitPlanes/index.html",cat:"all"},
{title:"Block Blast",img:"images/Block Blast.png",url:"games/Block Blast/index.html",cat:"all"},
{title:"Candy Crush",img:"images/Candy Crush.png",url:"games/Candy Crush/index.html",cat:"all"},
{title:"Cluster Rush",img:"images/Cluster Rush.png",url:"games/Cluster Rush/index.html",cat:"all"},
{title:"Core Ball",img:"images/Core Ball.png",url:"games/Core Ball/index.html",cat:"all"},
{title:"CS GO Clicker",img:"images/CS GO clicker.png",url:"games/CS GO clicker/index.html",cat:"all"},
{title:"CupHead",img:"images/CupHead.png",url:"games/Cuphead/index.html",cat:"all"},
{title:"Deltarune",img:"images/Deltarune.png",url:"games/Deltarune/index.html",cat:"all"},
{title:"Doge Miner",img:"images/Doge Miner.png",url:"games/Doge Miner/index.html",cat:"all"},
{title:"Drift Boss",img:"images/Drift Boss.png",url:"games/Drift Boss/index.html",cat:"all"},
{title:"Drive Mad",img:"images/Drive Mad.png",url:"games/Drive Mad/index.html",cat:"all"},
{title:"Five Nights At Epsteins",img:"images/Five Nights At Epsteins.png",url:"games/Five Nights At Epsteins/index.html",cat:"all"},
{title:"Fluidism",img:"images/Fluidism.png",url:"games/Fluidism/index.html",cat:"all"},
{title:"Geometry Dash",img:"images/GD.png",url:"games/Geometry Dash/index.html",cat:"all"},
{title:"Gladihoppers",img:"images/Gladihoppers.png",url:"games/Gladihoppers/index.html",cat:"all"},
{title:"Gold Digger FRVR",img:"images/Gold Digger FRVR.png",url:"games/Gold Digger FRVR/index.html",cat:"all"},
{title:"Google Dino",img:"images/Google Dino.png",url:"games/Google Dino/index.html",cat:"all"},
{title:"Granny",img:"images/Granny.png",url:"games/Granny/index.html",cat:"all"},
{title:"High Stakes",img:"images/High Stakes.png",url:"games/High Stakes/index.html",cat:"all"},
{title:"Icy Dodo",img:"images/Icy Dodo.png",url:"games/Icy Dodo/index.html",cat:"all"},
{title:"Iron Lung",img:"images/Iron Lung.png",url:"games/Iron Lung/index.html",cat:"all"},
{title:"Kour.io",img:"images/Kour.png",url:"games/Kour.io/index.html",cat:"all"},
{title:"Minecraft 1.8.8",img:"images/Minecraft 1.8.8.png",url:"games/Minecraft 1.8.8/index.html",cat:"all"},
{title:"Minecraft 1.12",img:"images/Minecraft 1.12.png",url:"games/Minecraft 1.12/index.html",cat:"all"},
{title:"Minecraft Beta 1.3",img:"images/Minecraft Beta 1.3.png",url:"games/Minecraft Beta 1.3/index.html",cat:"all"},
{title:"Polytrack",img:"images/polytrack.jpeg",url:"games/Polytrack/index.html",cat:"all"},
{title:"Silk",img:"images/Silk.png",url:"games/Silk/index.html",cat:"all"},
{title:"Slope Plus",img:"images/Slope Plus.png",url:"games/Slope Plus/index.html",cat:"all"},
{title:"Smash Karts",img:"images/Smash Karts.jpg",url:"games/Smash Karts/index.html",cat:"all"},
{title:"Spacebar Clicker",img:"images/Spacebar Clicker.png",url:"games/Spacebar Clicker/index.html",cat:"all"},
{title:"Tag",img:"images/Tag.png",url:"games/Tag/index.html",cat:"all"},
{title:"Tanuki Sunset",img:"images/tanuki sunset.jpg",url:"games/Tanuki Sunset/index.html",cat:"all"},
{title:"Time Shooter 2",img:"images/Time Shooter 2.jpg",url:"games/Time Shooter 2/index.html",cat:"all"},
{title:"Ultrakill",img:"images/Ultrakill.png",url:"games/ultrakill/index.html",cat:"all"},
{title:"We Become What We Behold",img:"images/We Become What We Behold.png",url:"games/We Become What We Behold/index.html",cat:"all"},
]

const movies=[
{title:"Shrek",img:"images/Shrek.png",url:"movies/shrek/index.html",cat:"comedy"}
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

render()
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

function updateMuteButton(){
if(!muteBtn) return
muteBtn.textContent=isMuted?"Unmute":"Mute"
muteBtn.classList.toggle("active",isMuted)
muteBtn.setAttribute("aria-pressed",String(isMuted))
}

function setRandomSplashText(){
if(!siteSubtitle) return
const randomIndex = Math.floor(Math.random() * splashTexts.length)
siteSubtitle.textContent = splashTexts[randomIndex]
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
try{
frame?.focus()
frame?.contentWindow?.focus()
}catch(e){}
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
frame?.requestFullscreen?.()
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
render()

// Debounced search input for better performance
document.getElementById('search').addEventListener('input',()=>{
clearTimeout(searchTimeout)
searchTimeout=setTimeout(()=>render(),250)
})