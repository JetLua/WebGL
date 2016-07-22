const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')



// 着色器源代码
const VSHADER_SRC = `
    attribute vec4 pos;
    void main() {
        gl_Position     = pos;
        gl_PointSize    = 10.0;
    }
`
const FSHADER_SRC = `
    void main() {
        gl_FragColor = vec4(.0, .0, 1.0, 1.0);
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

// 创建三角形顶点坐标
const vertices = new Float32Array([
    .0, .5,
    .5, .0,
    -.5, .0
])

// 创建缓冲区对象
const buf = gl.createBuffer()

// 绑定缓冲区对象
gl.bindBuffer(gl.ARRAY_BUFFER, buf)

// 将顶点坐标数据写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

// 将缓冲区分配给attribute变量pos
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

// 开启attribute变量pos
gl.enableVertexAttribArray(pos)

// 以指定颜色清空画布
gl.clearColor(1.0, .0, .0, .2)
gl.clear(gl.COLOR_BUFFER_BIT)

// 绘制点
gl.drawArrays(gl.TRIANGLES, 0, 3)
