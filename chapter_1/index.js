const gl = document.querySelector('canvas').getContext('webgl')

if (!gl) alert('Failed to get webgl')



// 着色器源代码
const VSHADER_SRC = `
	void main() {
		gl_Position 	= vec4(.0, .0, .0, 1.0);
		gl_PointSize 	= 10.0;
	}
`

const FSHADER_SRC = `
	void main() {
		gl_FragColor = vec4(.0, .0, 1.0, 1.0);
	}
`
gl.clearColor(1.0, .0, .0, .2)
gl.clear(gl.COLOR_BUFFER_BIT)


// 生成着色器源对象
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

// 绘制点
gl.drawArrays(gl.POINTS, 0, 1)