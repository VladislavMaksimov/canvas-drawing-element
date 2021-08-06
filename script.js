let states = []
let state = new Image
let stateIndex = -1

const setupContext = (context, color, width) => {
    context.strokeStyle = color
    context.lineWidth = width
    context.lineJoin = 'round'
    context.lineCap = 'round'
}

const saveDrawing = (canvas) => {
    const downloader = document.getElementById('downloader')
    const imgURL = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    downloader.href = imgURL
    downloader.click()
}

const penDown = (e, pen) => {
    pen.down = true
    pen.x = e.offsetX
    pen.y = e.offsetY
}

const draw = (e, context, pen, penWidth, penColor) => {
    if (!pen.down) return
    context.lineWidth = penWidth
    context.strokeStyle = penColor

    context.beginPath()
    context.moveTo(pen.x, pen.y)
    context.lineTo(e.offsetX, e.offsetY)
    context.stroke()
    pen.x = e.offsetX
    pen.y = e.offsetY
}

const undo = (canvas, context) => {
    if (stateIndex == -1) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (--stateIndex == -1) return
    state.src = states[stateIndex]
    state.onload = () => context.drawImage(state, 0, 0)
}

const redo = (canvas, context) => {
    if (stateIndex + 1 >= states.length) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    state.src = states[++stateIndex]
    state.onload = () => context.drawImage(state, 0, 0)
}

const clean = (canvas, context) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    states.splice(++stateIndex)
    states.push(canvas.toDataURL())
}

const penNotDown = (canvas, pen) => {
    if (!pen.down) return
    states.splice(++stateIndex)
    states.push(canvas.toDataURL())
    pen.down = false
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const penColor = document.getElementsByName('penColor')[0]
    const penWidth = document.getElementsByName('penWidth')[0]
    const saver = document.getElementById('saver')
    const cleaner = document.getElementById('cleaner')
    const undoElem = document.getElementById('undo')
    const redoElem = document.getElementById('redo')

    setupContext(context, penColor.value, penWidth.value)
    let pen = {
        x: 0,
        y: 0,
        down: false
    }
    state.width = canvas.width
    state.height = canvas.height

    saver.addEventListener('click', () => saveDrawing(canvas))
    undoElem.addEventListener('click', () => undo(canvas, context))
    redoElem.addEventListener('click', () => redo(canvas, context))
    cleaner.addEventListener('click', () => clean(canvas, context))
    canvas.addEventListener('mousedown', (e) => penDown(e, pen))
    canvas.addEventListener('mousemove', (e) => draw(e, context, pen, penWidth.value, penColor.value))
    canvas.addEventListener('mouseup', () => penNotDown(canvas, pen))
    canvas.addEventListener('mouseout', () => penNotDown(canvas, pen))
})