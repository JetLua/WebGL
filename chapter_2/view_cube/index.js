const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')



// 着色器源代码
const VSHADER_SRC = `
    attribute vec4 pos;
    uniform mat4 viewMatrix;
    attribute vec4 color;
    varying vec4 vColor;
    void main() {
        gl_Position     = viewMatrix * pos;
        vColor          = color;
    }
`
const FSHADER_SRC = `
    precision highp float;
    varying vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
`

// 视图大小
gl.viewport(0, 0, 1000, 500)

// 创建着色器对象
const fShader = gl.createShader(gl.FRAGMENT_SHADER)
const vShader = gl.createShader(gl.VERTEX_SHADER)

// 将着色器源码写入对象
gl.shaderSource(vShader, VSHADER_SRC)
gl.shaderSource(fShader, FSHADER_SRC)

// 编译着色器
gl.compileShader(vShader)
gl.compileShader(fShader)

// 创建程序
const program = gl.createProgram()

// 程序绑定着色器
gl.attachShader(program, vShader)
gl.attachShader(program, fShader)

// 链接程序
gl.linkProgram(program)

// 使用程序
gl.useProgram(program)

// 视图矩阵
const pMatrix = mat4.create()
const vMatrix = mat4.create()
mat4.perspective(pMatrix, Math.PI / 6, canvas.width / canvas.height, .1, 100)
mat4.lookAt(
    vMatrix, 
    [0, 3, 9],
    [0, 0, 0],
    [0, 1, 0]
)
let viewMatrix = mat4.create()
mat4.mul(viewMatrix, pMatrix, vMatrix)

// 获取uniform变量viewMatrix并赋值
const uVMatrix = gl.getUniformLocation(program, 'viewMatrix')
gl.uniformMatrix4fv(uVMatrix, false, viewMatrix)


// 顶点坐标数组
const mixes = new Float32Array([
    //前
    1.0, 1.0, 1.0, 0.0, 0.8, 0.0,
    -1.0, 1.0, 1.0, 0.0, 0.8, 0.0,
    -1.0, -1.0, 1.0, 0.0, 0.8, 0.0,
    1.0, -1.0, 1.0, 0.0, 0.8, 0.0,
    //后
    1.0, 1.0, -1.0, 0.6, 0.9, 0.0,
    -1.0, 1.0, -1.0, 0.6, 0.9, 0.0,
    -1.0, -1.0, -1.0, 0.6, 0.9, 0.0,
    1.0, -1.0, -1.0, 0.6, 0.9, 0.0,
    //上
    1.0, 1.0, -1.0, 1.0, 1.0, 0.0,
    -1.0, 1.0, -1.0, 1.0, 1.0, 0.0,
    -1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
    // 下
    1.0, -1.0, -1.0, 1.0, 0.5, 0.0,
    -1.0, -1.0, -1.0, 1.0, 0.5, 0.0,
    -1.0, -1.0, 1.0, 1.0, 0.5, 0.0,
    1.0, -1.0, 1.0, 1.0, 0.5, 0.0,
    //右
    1.0, 1.0, -1.0, 0.9, 0.0, 0.2,
    1.0, 1.0, 1.0, 0.9, 0.0, 0.2,
    1.0, -1.0, 1.0, 0.9, 0.0, 0.2,
    1.0, -1.0, -1.0, 0.9, 0.0, 0.2,
    //左
    -1.0, 1.0, -1.0, 0.6, 0.0, 0.6,
    -1.0, 1.0, 1.0, 0.6, 0.0, 0.6,
    -1.0, -1.0, 1.0, 0.6, 0.0, 0.6,
    -1.0, -1.0, -1.0, 0.6, 0.0, 0.6
])

// 顶点索引数据
const indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    8, 9, 10, 8, 10, 11,
    12, 14, 13, 12, 15, 14,
    16, 17, 18, 16, 18, 19,
    20, 22, 21, 20, 23, 22
])

// 创建缓冲区
const vBuf = gl.createBuffer()
const iBuf = gl.createBuffer()

// 将顶点数据写入缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, vBuf)
gl.bufferData(gl.ARRAY_BUFFER, mixes, gl.STATIC_DRAW)

// 分配缓冲区顶点数据给pos
const pos = gl.getAttribLocation(program, 'pos')
const size = mixes.BYTES_PER_ELEMENT
gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, size * 6, 0)
gl.enableVertexAttribArray(pos)

// 分配缓冲区颜色数据给color
const color = gl.getAttribLocation(program, 'color')
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, size * 6, size * 3)
gl.enableVertexAttribArray(color)

// 将索引数据写入缓冲区
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

// 指定画布背景并开启消除隐藏面
gl.clearColor(1.0, .0, .0, .2)
gl.enable(gl.DEPTH_TEST)

// 清空画布并绘制
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)


// 偏移角
const angle = {
    x: 0,
    y: 0
}

const rad = {
    x: 0,
    y: 0
}

const xAxis = [1, 0, 0]
const yAxis = [0, 1, 0]
const zAxis = [0, 0, 1]
const nZAxis = [0, 0, -1]


document.addEventListener('keydown', (e) => {
    angle.x = 0
    angle.y = 0
    switch (e.keyCode) {
        // ←
        case 37:
            angle.x = -1
            break
        // ↑ 
        case 38:
            angle.y = -1
            break
        // →
        case 39:
            angle.x = 1
            break
        // ↓
        case 40:
            angle.y = 1
            break
        default:
            break
    }
    rad.x = angle.x / 180 * Math.PI
    rad.y = angle.y / 180 * Math.PI
    mat4.rotate(viewMatrix, viewMatrix, rad.x, yAxis)
    mat4.rotate(viewMatrix, viewMatrix, rad.y, xAxis)
    gl.uniformMatrix4fv(uVMatrix, false, viewMatrix)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
})

document.addEventListener('wheel', (e) => {
    // 小
    if (e.deltaY > 0) mat4.translate(viewMatrix, viewMatrix, zAxis)
    else mat4.translate(viewMatrix, viewMatrix, nZAxis)
    gl.uniformMatrix4fv(uVMatrix, false, viewMatrix)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
})