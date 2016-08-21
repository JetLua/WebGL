const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')


// 逐顶点计算光照（被逐片元替代）
/*******************
const vShaderSrc = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    attribute vec4 aNormal;       // 法向量
    uniform mat4 uModelMatrix;    // 模型矩阵
    uniform mat4 uNormalMatrix;   // 法向量变换
    uniform vec3 uLightColor;     // 点光源颜色
    uniform vec3 uLightPosition;  // 点光源位置
    uniform vec3 uAmbientLight;   // 环境光颜色
    uniform mat4 uViewMatrix;
    varying vec4 vColor;
    void main() {
        gl_Position  = uViewMatrix * aPosition;
        gl_PointSize = 3.0;
        // 归一化法线
        vec3 normal = normalize(vec3(uNormalMatrix * aNormal));
        // 计算光线方向并归一化
        vec4 vertexPosition = uModelMatrix * aPosition;
        vec3 lightDirection = normalize(uLightPosition - vec3(vertexPosition));
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
***************************/

// 逐片元计算光照

const vShaderSrc = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    attribute vec4 aNormal;       // 法向量
    uniform mat4 uModelMatrix;    // 模型矩阵
    uniform mat4 uNormalMatrix;   // 法向量变换
    uniform mat4 uViewMatrix;
    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        gl_Position  = uViewMatrix * aPosition;
        vPosition    = vec3(uModelMatrix * aPosition);
        vNormal      = vec3(uNormalMatrix * aNormal);
        vColor       = aColor;
    }
`
const fShaderSrc = `
    precision highp float;
    uniform vec3 uLightColor;     // 点光源颜色
    uniform vec3 uLightPosition;  // 点光源位置
    uniform vec3 uAmbientLight;   // 环境光颜色
    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        // 归一化法线
        vec3 normal = normalize(vNormal);
        // 计算光线方向并归一化
        vec3 lightDirection = normalize(uLightPosition - vPosition);
        // 计算光线与法向量的点积
        float nDotL = max(dot(lightDirection, normal), .0);
        // 漫反射
        vec3 diffuse = uLightColor * vColor.rgb * nDotL;
        // 环境光反射的颜色
        vec3 ambient = uAmbientLight * vColor.rgb;
        gl_FragColor = vec4(diffuse + ambient, vColor.a);
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



// 球轨迹
let sphereVertices = []

// 法向量
let normalVertices = []

!function() {
    let m = n = 25
    let a, b
    let l, r = 1
    for (a = 1; a <= n; a++) {
        for (b = 1; b <= m; b++) {
            sphereVertices.push(
                ...v(a, b), ...v(a - 1, b),
                ...v(a - 1, b), ...v(a - 1, b - 1),
                ...v(a, b), ...v(a - 1, b + 1)
            )
        }
    }
    function v(a, b) {
        a = Math.PI * a / n
        b = 2 * Math.PI * b / n + a
        l = Math.sin(a) * r
        return [Math.sin(b) * l, Math.cos(a) * r, Math.cos(b) * l]
    }
}()

normalVertices = new Float32Array(sphereVertices.slice(0))
sphereVertices = new Float32Array(sphereVertices)

const size = sphereVertices.BYTES_PER_ELEMENT
const nums = sphereVertices.length / 3

const uAmbientLight  = gl.getUniformLocation(program, 'uAmbientLight')
const uLightPosition = gl.getUniformLocation(program, 'uLightPosition')
const uLightColor    = gl.getUniformLocation(program, 'uLightColor')
const aNormal        = gl.getAttribLocation(program, 'aNormal')
const uViewMatrix    = gl.getUniformLocation(program, 'uViewMatrix')
const uModelMatrix   = gl.getUniformLocation(program, 'uModelMatrix')
const uNormalMatrix  = gl.getUniformLocation(program, 'uNormalMatrix')
const aColor         = gl.getAttribLocation(program, 'aColor')
const aPosition      = gl.getAttribLocation(program, 'aPosition')



// 顶点数据写入
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ARRAY_BUFFER, sphereVertices, gl.STATIC_DRAW)
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aPosition)


// 环境光颜色
gl.uniform3f(uAmbientLight, .2, .2, .2)

// 点光源位置
let lightPosition = vec3.clone([.0, 6.0, 6.0])
gl.uniform3fv(uLightPosition, lightPosition)

// 点光源颜色
gl.uniform3f(uLightColor, .5, .5, .5)

// 法向量写入
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ARRAY_BUFFER, normalVertices, gl.STATIC_DRAW)
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aNormal)


// 视图模型矩阵
let mvpMatrix = mat4.create()
let pMatrix = mat4.create()
let vMatrix = mat4.create()
let mMatrix = mat4.create()
let nMatrix = mat4.create()
let eye = [0, 0, 4]
let center = [0, 0, 0]
let up = [0, 1, 0]


mat4.perspective(pMatrix, Math.PI / 6, canvas.width / canvas.height, .1, 100)
mat4.lookAt(vMatrix, eye, center, up)
mat4.mul(mvpMatrix, pMatrix, vMatrix)

// 绘制函数
const draw = () => {
    gl.uniform3fv(uLightPosition, lightPosition)
    gl.uniformMatrix4fv(uViewMatrix, false, mvpMatrix)
    gl.uniformMatrix4fv(uModelMatrix, false, mMatrix)
    gl.uniformMatrix4fv(uNormalMatrix, false, nMatrix)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.LINES, 0, nums)
}

// 开启混合 设置背景色
gl.enable(gl.BLEND)
gl.vertexAttrib4f(aColor, .3, .4, .5, .5)
gl.clearColor(.24, .36, .50, 1.0)
gl.blendFunc(gl.DST_ALPHA, gl.ONE)

// 绘制
draw()

// 鼠标操作
const angle = {
    x: 0,
    y: 0,
    z: 0
}
const axis = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
}
const jit = {
    x: [],
    y: [],
    z: []
}
const mouse = {}

// 模拟栈
const stack = []
const push = o => stack.push(o)
const pop = () => stack.pop()

let down = false

canvas.addEventListener('mousemove', e => {
    if (!down) return
    if (mouse.y - e.pageY >= 0) angle.y -= .01
    else angle.y += .01
    push(mat4.clone(vMatrix))
    push(mat4.clone(mvpMatrix))
    push(mat4.clone(mMatrix))
    push(mat4.clone(nMatrix))
    mat4.rotate(vMatrix, vMatrix, angle.y, axis.x)
    mat4.mul(mvpMatrix, pMatrix, vMatrix)
    mat4.rotate(mMatrix, mMatrix, angle.y, axis.x)
    mat4.invert(nMatrix, mMatrix)
    mat4.transpose(nMatrix, nMatrix)
    draw()
    nMatrix = pop()
    mMatrix = pop()
    mvpMatrix = pop()
    vMatrix = pop()
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


