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
    console.log(pen)
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

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const penColor = document.getElementsByName('penColor')[0]
    const penWidth = document.getElementsByName('penWidth')[0]
    const saver = document.getElementById('saver')
    const cleaner = document.getElementById('cleaner')

    setupContext(context, penColor.value, penWidth.value)
    let pen = {
        x: 0,
        y: 0,
        down: false
    }

    const penNotDown = () => pen.down = false
    const clean = () => context.clearRect(0, 0, canvas.width, canvas.height)

    saver.addEventListener('click', () => saveDrawing(canvas))
    cleaner.addEventListener('click', clean)
    canvas.addEventListener('mousedown', (e) => penDown(e, pen))
    canvas.addEventListener('mousemove', (e) => draw(e, context, pen, penWidth.value, penColor.value))
    canvas.addEventListener('mouseup', penNotDown)
    canvas.addEventListener('mouseout', penNotDown)
})