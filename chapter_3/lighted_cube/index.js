const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) alert('Failed to get webgl')



// 着色器源代码
const VSHADER_SRC = `
    attribute vec4 pos;
    attribute vec4 normal;          // 法向量
    uniform mat4 viewMatrix;        // 视图矩阵
    uniform vec3 lightColor;        // 光线颜色
    uniform vec3 lightDirection;    // 光线方向
    uniform vec3 ambientLight;      // 环境光
    attribute vec4 color;
    varying vec4 vColor;
    void main() {
        gl_Position  = viewMatrix * pos;
        vec3 _normal = normalize(normal.xyz);
        // 计算光线和法向量点积
        float nDotL  = max(dot(lightDirection, _normal), .0);
        // 漫反射光的颜色
        vec3 diffuse = lightColor * color.rgb * nDotL;
        // 环境光
        vec3 ambient = ambientLight * color.rgb;
        // 最终颜色
        vColor       = vec4(diffuse + ambient, color.a);
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

// 顶点坐标数组
const vertices = new Float32Array([
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
])

// 顶点索引数据
const indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
])

const colors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
])

const normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
]);

// 创建缓冲区
const vBuf = gl.createBuffer()
const cBuf = gl.createBuffer()
const nBuf = gl.createBuffer()
const iBuf = gl.createBuffer()

// 将顶点数据写入缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, vBuf)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
const pos = gl.getAttribLocation(program, 'pos')
const size = vertices.BYTES_PER_ELEMENT
gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, size * 3, 0)
gl.enableVertexAttribArray(pos)

// 分配缓冲区颜色数据给color
gl.bindBuffer(gl.ARRAY_BUFFER, cBuf)
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
const color = gl.getAttribLocation(program, 'color')
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, size * 3, 0)
gl.enableVertexAttribArray(color)

// 法向量
gl.bindBuffer(gl.ARRAY_BUFFER, nBuf)
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
const normal = gl.getAttribLocation(program, 'normal')
gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, size * 3, 0)
gl.enableVertexAttribArray(normal)

// 将索引数据写入缓冲区
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

// 视图矩阵
const pMatrix = mat4.create()
const vMatrix = mat4.create()
mat4.perspective(pMatrix, Math.PI / 6, canvas.width / canvas.height, .1, 100)
mat4.lookAt(
    vMatrix,
    [3, 3, 7],
    [0, 0, 0],
    [0, 1, 0]
)
const viewMatrix = mat4.create()
mat4.mul(viewMatrix, pMatrix, vMatrix)
// 获取uniform变量viewMatrix并赋值
gl.uniformMatrix4fv(gl.getUniformLocation(program, 'viewMatrix'), false, viewMatrix)


// 设置光线颜色和方向
const lightColor = gl.getUniformLocation(program, 'lightColor')
const uLightDirection = gl.getUniformLocation(program, 'lightDirection')
const ambient = gl.getUniformLocation(program, 'ambientLight')
gl.uniform3f(lightColor, 1.0, 1.0, 1.0)
gl.uniform3f(ambient, .2, .2, .2)

let lightDirection = vec3.clone([.5, 3.0, 4.0])
vec3.normalize(lightDirection, lightDirection)
console.log(lightDirection)
gl.uniform3fv(uLightDirection, lightDirection)




// 指定画布背景并开启消除隐藏面
gl.clearColor(1.0, .0, .0, .2)
gl.enable(gl.DEPTH_TEST)

// 清空画布并绘制
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
