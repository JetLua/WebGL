import mushroom from './mushroom.js'

const load = arr => {
    const queue = arr.map(uri => {
        return new Promise(resolve => {
            fetch(uri)
                .then(res => res.text())
                .then(data => resolve(data))
        })
    })
    return Promise.all(queue)
}

load([
    'shaders/vertex.glsl',
    'shaders/fragment.glsl'
]).then(results => {
    const
        canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    document.body.appendChild(canvas)

    // 视图大小
    gl.viewport(0, 0, window.innerWidth, window.innerHeight)

    // 创建着色器对象
    const
        fShader = gl.createShader(gl.FRAGMENT_SHADER),
        vShader = gl.createShader(gl.VERTEX_SHADER),
        program = gl.createProgram()

    // 将着色器源码写入对象
    gl.shaderSource(vShader, results[0])
    gl.shaderSource(fShader, results[1])

    // 编译着色器
    gl.compileShader(vShader)
    gl.compileShader(fShader)

    // 程序绑定着色器
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)

    // 链接
    gl.linkProgram(program)

    // 使用
    gl.useProgram(program)

    // 顶点坐标
    const vertices = new Float32Array(mushroom.meshes[0].positions)
    const indices = new Uint8Array(mushroom.meshes[0].indices)

    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

    // 将顶点坐标数据写入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, 'aPos')

    // 将缓冲区分配给attribute变量pos
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0)

    // 开启attribute变量pos
    gl.enableVertexAttribArray(pos)

    // uv
    const uv = new Float32Array(mushroom.meshes[0].uvs)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW)

    const coord = gl.getAttribLocation(program, 'aCoord')
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(coord)

    // 创建纹理
    const texture = gl.createTexture()

    const sampler = gl.getUniformLocation(program, 'uSampler')

    const img = new Image()

    img.onload = function() {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this)
        gl.uniform1i(sampler, 0)

        // 指定画布背景并开启消除隐藏面
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.enable(gl.DEPTH_TEST)

        // 清空画布并绘制
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        // 绘制点
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)

    }

    img.src = 'src/mushroom.png'



    // 将索引数据写入缓冲区
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    // 视图模型矩阵
    let mvpMatrix = mat4.create()
    let pMatrix = mat4.create()
    let vMatrix = mat4.create()
    let mMatrix = mat4.create()
    let nMatrix = mat4.create()
    let eye = [0, 3, 17]
    let center = [0, 0, 0]
    let up = [0, 1, 0]


    mat4.perspective(pMatrix, Math.PI / 6, canvas.width / canvas.height, .1, 100)
    mat4.lookAt(vMatrix, eye, center, up)
    mat4.mul(mvpMatrix, pMatrix, vMatrix)

    // 获取uniform变量viewMatrix并赋值
    const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix')
    gl.uniformMatrix4fv(uViewMatrix, false, mvpMatrix)

    // 绘制函数
    const draw = () => {
        gl.uniformMatrix4fv(uViewMatrix, false, mvpMatrix)
        // 清空画布并绘制
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        // 绘制点
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)

        requestAnimationFrame(draw)
    }

    draw()

    // 鼠标操作
    const axis = {
        x: [1, 0, 0],
        y: [0, 1, 0],
        z: [0, 0, 1]
    }

    const mouse = {}

    // 模拟栈
    const stack = []
    const push = o => stack.push(o)
    const pop = () => stack.pop()

    let down = false

    const degToRad = degrees => degrees * Math.PI / 1000
    const rMatrix = mat4.create()

    canvas.addEventListener('mousemove', e => {
        if (!down) return
        mouse.deltaX = e.pageX - mouse.x
        mouse.deltaY = e.pageY - mouse.y

        mat4.identity(rMatrix)
        mat4.rotate(rMatrix, rMatrix, degToRad(mouse.deltaX), axis.y)
        mat4.rotate(rMatrix, rMatrix, degToRad(mouse.deltaY), axis.x)
        mat4.mul(mMatrix, rMatrix, mMatrix)
        push(mat4.clone(vMatrix))
        mat4.mul(vMatrix, vMatrix, mMatrix)
        mat4.mul(mvpMatrix, pMatrix, vMatrix)
        vMatrix = pop()
        mouse.x = e.pageX
        mouse.y = e.pageY
    })

    canvas.addEventListener('mousedown', e => {
        down = true
        mouse.x = e.pageX
        mouse.y = e.pageY
    })

    document.addEventListener('mouseup', e => {
        down = false
    })
})