const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')

canvas.width = 500
canvas.height = 500

gl.viewport(0, 0, 500, 500)
// 着色器源代码
const VSHADER_SRC = `
    attribute vec4 pos;
    attribute vec2 coord;
    varying vec2 vCoord;
    void main() {
        gl_Position     = pos;
        vCoord          = coord;
    }
`
const FSHADER_SRC = `
    precision highp float;
    uniform sampler2D sampler;
    varying vec2 vCoord;
    uniform float uPhi;
    uniform float uOmega;
    void main() {
        vec2 pos = vCoord;
        pos.x = pos.x + .01 * sin(uPhi + pos.x * uOmega);
        pos.y = pos.y + .01 * sin(uPhi + pos.y * uOmega);
        gl_FragColor = texture2D(sampler, pos);
    }
`

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

// 获取attribute变量pos
const pos = gl.getAttribLocation(program, 'pos')

// 获取attribute变量coord
const coord = gl.getAttribLocation(program, 'coord')

// 顶点与纹理坐标
const mixes = new Float32Array([
    -1.1, 1.1, .0, 1.0,
    -1.1, -1.1, .0, .0,
    1.1, 1.1, 1.0, 1.0,
    1.1, -1.1, 1.0, 0,
])

const size = mixes.BYTES_PER_ELEMENT

// 创建缓冲区对象
const buf = gl.createBuffer()

// 绑定缓冲区对象
gl.bindBuffer(gl.ARRAY_BUFFER, buf)

// 将顶点坐标数据写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, mixes, gl.STATIC_DRAW)

// 将缓冲区内的顶点数据分配给attribute变量pos
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, size * 4, 0)

// 开启attribute变量pos
gl.enableVertexAttribArray(pos)

// 将缓冲区内的纹理坐标分配给attribute变量coord
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, size * 4, size * 2)

// 开启attribute变量coord
gl.enableVertexAttribArray(coord)

// 创建纹理对象
const texture = gl.createTexture()

// 获取uniform变量sampler
const sampler = gl.getUniformLocation(program, 'sampler')

// 创建image对象
const img = new Image

img.onload = function() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this)
    gl.uniform1i(sampler, 0)
    draw()
}

img.src = 'warm.jpg'

const uOmega = gl.getUniformLocation(program, 'uOmega')
const uPhi = gl.getUniformLocation(program, 'uPhi')

let phi = 0

const draw = () => {
    gl.uniform1f(uPhi, phi += .01)
    gl.uniform1f(uOmega, 20)
    phi > Math.PI * 2 ? phi = 0 : null
    // 以指定颜色清空画布
    gl.clearColor(1.0, .0, .0, .2)
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 绘制点
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    requestAnimationFrame(draw)
}


