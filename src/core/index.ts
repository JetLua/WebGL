import {hex2rgb} from './utils'

let gl: WebGLRenderingContext

function compile(vs: string, fs: string): WebGLProgram {
    const
        shader = {
            vert: gl.createShader(gl.VERTEX_SHADER),
            frag: gl.createShader(gl.FRAGMENT_SHADER)
        },

        program = gl.createProgram()

    gl.shaderSource(shader.vert, vs)
    gl.shaderSource(shader.frag, fs)

    gl.compileShader(shader.vert)
    gl.compileShader(shader.frag)

    gl.attachShader(program, shader.vert)
    gl.attachShader(program, shader.frag)

    gl.linkProgram(program)
    gl.useProgram(program)

    return program
}


function clear(color: number, alpha = 1.0) {
    const rgb = hex2rgb(color)
    gl.clearColor(rgb[0], rgb[1], rgb[2], alpha)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function init() {
    const canvas = document.querySelector('canvas')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    gl = canvas.getContext('webgl', {
        antialias: true,
        stencil: true
    })
    gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight)
}

function createBuffer(target: GLenum, data: any, usage = gl.STATIC_DRAW): WebGLBuffer {
    const buffer = gl.createBuffer()
    gl.bindBuffer(target, buffer)
    gl.bufferData(target, data, usage)
    return buffer
}

function deleteBuffer(buffer: WebGLBuffer) {
    gl.deleteBuffer(buffer)
}

function vertexAttribPointer(program: WebGLProgram, name: string, size: number,
    type: GLenum, normalized: GLboolean, stride: number, offset: number) {
    const addr = gl.getAttribLocation(program, name)
    gl.vertexAttribPointer(addr, size, type, normalized, stride, offset)
    gl.enableVertexAttribArray(addr)
}

function createTexture(img: any) {
    const texture = gl.createTexture()

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
}

function uniformMatrix4fv(program: WebGLProgram, name: string,
    val: ArrayLike<number>, transpose = false) {
    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, name),
        transpose,
        val
    )
}

function uniform2f(program: WebGLProgram, name: string, x: number, y: number) {
    gl.uniform2f(
        gl.getUniformLocation(program, name),
        x, y
    )
}

function uniformMatrix3fv(program: WebGLProgram, name: string, matrix: any, transpose=false) {
    gl.uniformMatrix3fv(
        gl.getUniformLocation(program, name),
        transpose,
        matrix
    )
}

function bufferSubData(target: number, offset: number, data: any) {
    gl.bufferSubData(target, offset, data)
}

export {
    bufferSubData,
    createTexture,
    createBuffer,
    compile,
    clear,
    deleteBuffer,
    gl,
    init,
    uniformMatrix4fv,
    uniform2f,
    uniformMatrix3fv,
    vertexAttribPointer,
}