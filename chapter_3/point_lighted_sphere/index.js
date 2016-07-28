const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')

const vShaderSrc = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    attribute vec4 aNormal;       // 法向量
    uniform vec3 uLightColor;     // 点光源颜色
    uniform vec3 uLightPosition;  // 点光源位置
    uniform vec3 uAmbientLight;   // 环境光颜色
    uniform mat4 uViewMatrix;
    varying vec4 vColor;
    void main() {
        gl_Position  = uViewMatrix * aPosition;
        // 归一化法线
        vec3 normal = normalize(vec3(aNormal));
        // 计算光线方向并归一化
        vec3 lightDirection = normalize(uLightPosition - vec3(aNormal));
        // 计算光线与法向量的点积
        float nDotL = max(dot(lightDirection, normal), .0);
        // 漫反射
        vec3 diffuse = uLightColor * aColor.rgb * nDotL;
        // 环境光反射的颜色
        vec3 ambient = uAmbientLight * aColor.rgb;
        vColor       = vec4(diffuse + ambient, aColor.a);
    }
`
const fShaderSrc = `
    precision highp float;
    varying vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
`
// 创建着色器对象
const vShader = gl.createShader(gl.VERTEX_SHADER)
const fShader = gl.createShader(gl.FRAGMENT_SHADER)

// 将着色器源码写入对象
gl.shaderSource(vShader, vShaderSrc)
gl.shaderSource(fShader, fShaderSrc)

// 编译着色器
gl.compileShader(vShader)
gl.compileShader(fShader)

// 创建程序
const program = gl.createProgram()

// 程序绑定着色器对象
gl.attachShader(program, vShader)
gl.attachShader(program, fShader)

// 链接程序
gl.linkProgram(program)

// 使用程序
gl.useProgram(program)

// 视图矩阵
const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix')
const pMatrix = mat4.create()
const vMatrix = mat4.create()

mat4.perspective(pMatrix, Math.PI / 6, canvas.width / canvas.height, .1, 100)
mat4.lookAt(
    vMatrix,
    [0, 2, 4],
    [0, 0, 0],
    [0, 1, 0]
)

let viewMatrix = mat4.create()
mat4.mul(viewMatrix, pMatrix, vMatrix)
gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)

// 圆形轨迹
let circleVertices = []

!function() {
    let n = 20
    let a, b
    let l
    for (a = 1; a <= n; a++) {
        for (b = 1; b <= n; b++) {
            circleVertices.push(
                ...v(a, b), ...v(a - 1, b),
                ...v(a, b - 1), ...v(a, b - 1),
                ...v(a - 1, b), ...v(a - 1, b - 1)
            )
        }
    }
    function v(a, b) {
        a = Math.PI * a / n
        b = 2 * Math.PI * b / n
        l = Math.sin(a)
        return [Math.sin(b) * l, Math.cos(a), Math.cos(b) * l]
    }
}()

let normalVertices = new Float32Array(circleVertices.slice(0))
circleVertices = new Float32Array(circleVertices)
const size = circleVertices.BYTES_PER_ELEMENT
const l = circleVertices.length / 3
// 创建顶点缓冲区
const vBuf = gl.createBuffer()

// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, vBuf)

// 将顶点数据写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, circleVertices, gl.STATIC_DRAW)

// 将缓冲区数据分配到变量aPosition
const aPosition = gl.getAttribLocation(program, 'aPosition')
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aPosition)



// 环境光
const uAmbientLight = gl.getUniformLocation(program, 'uAmbientLight')
gl.uniform3f(uAmbientLight, .2, .2, .2)

// 点光源位置
const uLightPosition = gl.getUniformLocation(program, 'uLightPosition')
gl.uniform3f(uLightPosition, .0, 0.0, 6.0)

// 点光源颜色
const uLightColor = gl.getUniformLocation(program, 'uLightColor')
gl.uniform3f(uLightColor, .5, .5, .5)

// 法向量
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ARRAY_BUFFER, normalVertices, gl.STATIC_DRAW)
const aNormal = gl.getAttribLocation(program, 'aNormal')
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aNormal)


// 绘制
gl.clearColor(.24, .36, .60, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
const aColor = gl.getAttribLocation(program, 'aColor')
gl.vertexAttrib4f(aColor, .3, .4, .7, .5)
gl.enable(gl.BLEND)
gl.blendFunc(gl.DST_ALPHA, gl.ONE)
gl.drawArrays(gl.LINES, 0, l)

// gl.vertexAttrib4f(aColor, .24, .36, .60, .01)
// // gl.blendFunc(gl.DST_ALPHA, gl.ONE)
// // gl.disable(gl.BLEND)
// gl.drawArrays(gl.TRIANGLES, 0, l)











