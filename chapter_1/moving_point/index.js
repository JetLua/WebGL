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
gl.vertexAttrib3f(pos, .0, .0, .0)

// 以指定颜色清空画布
gl.clearColor(1.0, .0, .0, .2)
gl.clear(gl.COLOR_BUFFER_BIT)

// 绘制点
gl.drawArrays(gl.POINTS, 0, 1)

// 鼠标移动事件监听
const origin = [500, 250]
canvas.addEventListener('mousemove', (e) => {
    gl.vertexAttrib3f(
        pos, 
        e.offsetX / origin[0] - 1,
        1 - e.offsetY / origin[1],
        .0
    )
    gl.clearColor(1.0, .0, .0, .2)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, 1)
})