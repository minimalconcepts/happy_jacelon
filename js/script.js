const rotateScreen = document.getElementById("rotateMessage")

setTimeout(() => {

rotateScreen.style.display="none"
startMatrix()
showWords()

},5000)


/*canvas auxiliar*/
const bufferCanvas = document.createElement("canvas")
const bufferCtx = bufferCanvas.getContext("2d")
/* MATRIX */

const canvas = document.getElementById("matrixCanvas")
const ctx = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

function resizeCanvas(){

dpr = window.devicePixelRatio || 1

canvas.width = window.innerWidth * dpr
canvas.height = window.innerHeight * dpr

textCanvas.width = window.innerWidth * dpr
textCanvas.height = window.innerHeight * dpr

ctx.setTransform(1,0,0,1,0,0)
ctx.scale(dpr,dpr)

textCtx.setTransform(1,0,0,1,0,0)
textCtx.scale(dpr,dpr)

resetMatrix()

}
window.addEventListener("resize",resizeCanvas)

const textCanvas = document.getElementById("textCanvas")
const textCtx = textCanvas.getContext("2d")

textCanvas.height = window.innerHeight
textCanvas.width = window.innerWidth

const letters = "0123456789"

const fontSize = 16

const columns = canvas.width / fontSize

const drops = []

for(let x=0;x<columns;x++)
drops[x]=1

function drawMatrix(){

ctx.fillStyle="rgba(0,0,0,0.05)"
ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="#ff4da6"
ctx.font=fontSize+"px monospace"

for(let i=0;i<drops.length;i++){

const text = letters.charAt(Math.floor(Math.random()*letters.length))

ctx.fillText(text,i*fontSize,drops[i]*fontSize)

if(drops[i]*fontSize > canvas.height && Math.random()>0.975)
drops[i]=0

drops[i]++

}

}

/*soporte para celular*/
function rebuildScene(){

// limpiar partículas
particlesTexto = []
particlesBorde = []

// limpiar canvas
ctx.clearRect(0,0,canvas.width,canvas.height)
textCtx.clearRect(0,0,textCanvas.width,textCanvas.height)

// reiniciar matrix
resetMatrix()

// volver a dibujar lo que iba
if(fraseActual < frases.length){
createTextParticles(frases[fraseActual])
}

}

let matrixInterval

function startMatrix(){

matrixInterval = setInterval(drawMatrix,35)

}

function resetMatrix(){

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const newColumns = Math.floor(canvas.width / fontSize)

drops.length = 0

for(let x=0;x<newColumns;x++){
drops[x] = 1
}

}




/* TEXTO */
let dpr = window.devicePixelRatio || 1

canvas.width = window.innerWidth * dpr
canvas.height = window.innerHeight * dpr
ctx.scale(dpr,dpr)

textCanvas.width = window.innerWidth * dpr
textCanvas.height = window.innerHeight * dpr
textCtx.scale(dpr,dpr)

/* MATRIZ DE LETRAS */

const font = {

H:[
[1,0,1],
[1,0,1],
[1,1,1],
[1,0,1],
[1,0,1]
],

A:[
[0,1,0],
[1,0,1],
[1,1,1],
[1,0,1],
[1,0,1]
],

P:[
[1,1,0],
[1,0,1],
[1,1,0],
[1,0,0],
[1,0,0]
],

Y:[
[1,0,1],
[1,0,1],
[0,1,0],
[0,1,0],
[0,1,0]
],

B:[
[1,1,0],
[1,0,1],
[1,1,0],
[1,0,1],
[1,1,0]
],

I:[
[1,1,1],
[0,1,0],
[0,1,0],
[0,1,0],
[1,1,1]
],

R:[
[1,1,0],
[1,0,1],
[1,1,0],
[1,0,1],
[1,0,1]
],

T:[
[1,1,1],
[0,1,0],
[0,1,0],
[0,1,0],
[0,1,0]
],

D:[
[1,1,0],
[1,0,1],
[1,0,1],
[1,0,1],
[1,1,0]
],

E:[
[1,1,1],
[1,0,0],
[1,1,0],
[1,0,0],
[1,1,1]
],

S:[
[0,1,1],
[1,0,0],
[0,1,0],
[0,0,1],
[1,1,0]
]

}
function animateLEDWord(word){

let isMobile = window.innerWidth < 600

const size = isMobile ? 12 : 20
const spacing = isMobile ? 6 : 10

const letterWidth = 3*(size+spacing)
const startX = textCanvas.width/2 - (word.length*letterWidth)/2
const startY = textCanvas.height/2 - 50

let leds = []

for(let l=0;l<word.length;l++){

const letter = font[word[l]]

if(!letter) continue

for(let row=0;row<letter.length;row++){

for(let col=0;col<letter[row].length;col++){

if(letter[row][col]==1){

leds.push({
x: startX + l*120 + col*(size+spacing),
y: startY + row*(size+spacing)
})

}

}

}

}

let i = 0

function lightNext(){

if(i >= leds.length) return

const led = leds[i]

textCtx.beginPath()
textCtx.arc(led.x,led.y,size/2,0,Math.PI*2)
textCtx.fillStyle="#ff4da6"
textCtx.shadowBlur = 15
textCtx.shadowColor = "#ff4da6"
textCtx.fill()

i++

setTimeout(lightNext,30)

}
textCtx.clearRect(0,0,textCanvas.width,textCanvas.height)
lightNext()

}



function showWords(){

const words = ["HAPPY","BIRTHDAY","BESTY"]

let index = 0

function nextWord(){

if(index >= words.length){

setTimeout(startNextAnimation,2000)
return

}
textCtx.clearRect(0,0,textCanvas.width,textCanvas.height)

animateLEDWord(words[index])

index++

setTimeout(nextWord,3500)

}

nextWord()

}

/*nueva animacion*/
/*variables*/
let frases = [
"Eres una persona encantadora",
"Eres tan única y especial",
"como lo es el Lamborghini Veneno",
"Tan querida como el",
"mundo del rally",
"Tan hermosa como ",
"un Porsche 912",
"en cada una de sus generaciones",
"una mirada tan fina", 
"como un koenigsegg",
"y un corazon tan tierno",
"como un miata",
"sigue con tu manera de ser",
"te amamos como eres"
]

let fraseActual = 0

/*code*/
let hue = 0

let particlesTexto = []
let particlesBorde = []
let visibleCount = 0
function startNextAnimation(){

clearInterval(matrixInterval)

textCtx.clearRect(0,0,textCanvas.width,textCanvas.height)

textCtx.fillStyle="black"
textCtx.fillRect(0,0,textCanvas.width,textCanvas.height)

setTimeout(startParticles,2000)

}




function drawParticles(){

hue += 0.5


textCtx.fillStyle="black"
textCtx.fillRect(0,0,textCanvas.width,textCanvas.height)

for(let p of particlesTexto){

if(p.tx==null){

p.vy += 0.03

p.x+=p.vx
p.y+=p.vy

}else{

p.x += (p.tx-p.x)*0.07
p.y += (p.ty-p.y)*0.07

}

textCtx.beginPath()
textCtx.arc(p.x,p.y,2,0,Math.PI*2)
textCtx.fillStyle = `hsl(${hue},100%,60%)`
textCtx.fill()

}



requestAnimationFrame(drawParticles)

}



function startParticles(){

particlesTexto = []
particlesBorde = []

let isMobile = window.innerWidth < 600

let total = isMobile ? 1500 : 2500
let textoCount = isMobile ? 700 : 1200

for(let i = 0; i < total; i++){

let p = {
x: Math.random()*textCanvas.width,
y: Math.random()*textCanvas.height,
vx:(Math.random()-0.5)*1,
vy:(Math.random()-0.5)*1,
tx:null,
ty:null
}

if(i < textoCount){
particlesTexto.push(p)
}else{
particlesBorde.push(p)
}

}

// posicionar borde
posicionarBordes()

// 🔥 iniciar animación de partículas
drawParticles()

// 🔥 iniciar textos
setTimeout(()=>{
createTextParticles(frases[0])
setTimeout(siguienteFrase,2000)
},4000)

}


function posicionarBordes(){

let margin = 20 // ≈ 5mm visual

for(let p of particlesBorde){

let zona = Math.floor(Math.random()*4)

// arriba
if(zona===0){
p.x = Math.random()*textCanvas.width
p.y = Math.random()*margin
}

// abajo
else if(zona===1){
p.x = Math.random()*textCanvas.width
p.y = textCanvas.height - Math.random()*margin
}

// izquierda
else if(zona===2){
p.x = Math.random()*margin
p.y = Math.random()*textCanvas.height
}

// derecha
else{
p.x = textCanvas.width - Math.random()*margin
p.y = Math.random()*textCanvas.height
}

// movimiento suave dentro de la zona
p.vx = (Math.random()-0.5)*0.5
p.vy = (Math.random()-0.5)*0.5

}

}


function createTextParticles(message){

// reiniciar destinos
for(let p of particlesTexto){
p.tx = null
p.ty = null
}

// usar canvas normal (sin dpr)
bufferCanvas.width = window.innerWidth
bufferCanvas.height = window.innerHeight

bufferCtx.clearRect(0,0,bufferCanvas.width,bufferCanvas.height)

bufferCtx.fillStyle="white"
let fontSizeResponsive = window.innerWidth < 600 ? 60 : 110
bufferCtx.font = `bold ${fontSizeResponsive}px Arial`
bufferCtx.textAlign="center"
bufferCtx.textBaseline="middle"

bufferCtx.fillText(
message,
bufferCanvas.width/2,
bufferCanvas.height/2
)

// leer datos correctamente
let data = bufferCtx.getImageData(0,0,bufferCanvas.width,bufferCanvas.height).data

let i = 0

let gap = window.innerWidth < 600 ? 6 : 4

for(let y=0;y<bufferCanvas.height;y+=gap){
for(let x=0;x<bufferCanvas.width;x+=gap){

let index = (y*bufferCanvas.width + x)*4

let alpha = data[index+3]

if(alpha > 150 && particlesTexto[i]){

// 🔥 AQUÍ SÍ funciona bien
particlesTexto[i].tx = (x / bufferCanvas.width) * textCanvas.width
particlesTexto[i].ty = (y / bufferCanvas.height) * textCanvas.height

i++

}

}
}

// sobrantes al centro
for(let j=i; j<particlesTexto.length; j++){

particlesTexto[j].tx = textCanvas.width/2
particlesTexto[j].ty = textCanvas.height/2 + 80

}

}
function siguienteFrase(){

fraseActual++

if(fraseActual < frases.length){

createTextParticles(frases[fraseActual])

setTimeout(siguienteFrase,8000)

}else{

setTimeout(explosionFinal,2000)

}

}

function explosionFinal(){

let centerX = textCanvas.width/2
let centerY = textCanvas.height/2

for(let p of particlesTexto){

let angle = Math.random()*Math.PI*2
let speed = Math.random()*6 + 2

p.vx = Math.cos(angle)*speed
p.vy = Math.sin(angle)*speed

// pequeño caos
p.vx += (Math.random()-0.5)*2
p.vy += (Math.random()-0.5)*2

p.tx = null
p.ty = null

}

setTimeout(finalizarAnimacion,4000)

}

/*iniciar la ultima parte*/

function finalizarAnimacion(){

// detener animación
particlesTexto = []
particlesBorde = []

// ocultar canvas
canvas.style.display = "none"
textCanvas.style.display = "none"
// cambiar fondo
document.body.style.background = "#0b1d51"

// mostrar album
document.getElementById("album").style.display="flex"

/*soporte para celular*/

window.addEventListener("orientationchange", () => {

setTimeout(() => {

resizeCanvas()
rebuildScene()

}, 300)

})

}
