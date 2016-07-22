const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')



// 着色器源代码
const VSHADER_SRC = `
    attribute vec4 pos;
    attribute vec4 color;
    varying vec4 vColor;
    void main() {
        gl_Position     = pos;
        gl_PointSize    = 10.0;
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

// 获取varying变量color
const color = gl.getAttribLocation(program, 'color')

// 创建三角形顶点坐标和颜色值
const mixes = new Float32Array([
    .0, .5, 1.0, .0, .0,
    .5, .0, .0, 1.0, .0,
    -.5, .0, .0, .0, 1.0
])

const size = mixes.BYTES_PER_ELEMENT

// 创建缓冲区对象
const buf = gl.createBuffer()

// 绑定缓冲区对象
gl.bindBuffer(gl.ARRAY_BUFFER, buf)

// 将顶点坐标数据写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, mixes, gl.STATIC_DRAW)

// 将缓冲区内的顶点数据分配给attribute变量pos
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, size * 5, 0)

// 开启attribute变量pos
gl.enableVertexAttribArray(pos)

// 将缓冲区内的颜色数据分配给attribute变量color
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, size * 5, size * 2)

// 开启attribute变量color
gl.enableVertexAttribArray(color)



// 以指定颜色清空画布
gl.clearColor(1.0, .0, .0, .2)
gl.clear(gl.COLOR_BUFFER_BIT)

// 绘制点
gl.drawArrays(gl.TRIANGLES, 0, 3)
