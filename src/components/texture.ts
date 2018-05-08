import {mat4, vec2} from 'gl-matrix'
import * as core from '../core/index'
import vs from '../shaders/texture.vert'
import fs from '../shaders/texture.frag'
import player from '../static/textures/player.png'

const {drawingBufferWidth: width, drawingBufferHeight: height} = core.gl

const program = core.compile(vs, fs)
core.gl.linkProgram(program)
core.gl.useProgram(program)


const img = new Image()
img.onload = function() {

    const
        ratio = {
            screen: width / height,
            h: (this as HTMLImageElement).height / height,
            w: (this as HTMLImageElement).width  / width,
        }

    ratio.screen > 1 ? ratio.h /= ratio.screen : ratio.w *= ratio.screen

    const mixes = new Float32Array([
        -1 * ratio.w, ratio.h, .0, 1.0,
        -1 * ratio.w, -1 * ratio.h, .0, .0,
        ratio.w, ratio.h, 1.0, 1.0,
        ratio.w, -1 * ratio.h, 1.0, .0
    ]),
    bSize = mixes.BYTES_PER_ELEMENT

    core.createBuffer(core.gl.ARRAY_BUFFER, mixes)
    core.vertexAttrib(program, 'aPosition', 2, core.gl.FLOAT, false, bSize* 4, 0)
    core.vertexAttrib(program, 'aCoord', 2, core.gl.FLOAT, false, bSize* 4, bSize * 2)
    core.createTexture(img)
    core.gl.uniform1i(core.gl.getUniformLocation(program, 'uSampler'), 0)

    core.clear(0xffffff, 1)
    core.gl.drawArrays(core.gl.TRIANGLE_STRIP, 0, 4)
}

img.src = player


const
    pMatrix = mat4.create(),
    vMatrix = mat4.create(),
    rMatrix = mat4.create()

mat4.perspective(pMatrix, Math.PI / 6, width / height, 0, 100)
mat4.lookAt(vMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0])

core.uniformMatrix4fv(program, 'pMatrix', pMatrix)
core.uniformMatrix4fv(program, 'vMatrix', vMatrix)
core.uniformMatrix4fv(program, 'rMatrix', rMatrix)

setInterval(() => {
    mat4.rotateY(rMatrix, rMatrix, .01)
    core.uniformMatrix4fv(program, 'rMatrix', rMatrix)
    core.clear(0xffffff, 1)
    core.gl.drawArrays(core.gl.TRIANGLE_STRIP, 0, 4)
})


/*
* 适配测试
* 有待优化
*/
window.addEventListener('resize', ev => {
    const
        canvas = core.gl.canvas,
        {offsetWidth: w, offsetHeight: h} = canvas

    canvas.width = w
    canvas.height = h
    core.gl.viewport(0, 0, w, h)


    const
        ratio = {
            screen: w / h,
            w: (img as HTMLImageElement).width / w,
            h: (img as HTMLImageElement).height  / h,
        }

    ratio.screen > 1 ? ratio.h /= ratio.screen : ratio.w *= ratio.screen

    const
        mixes = new Float32Array([
            -1 * ratio.w, ratio.h, .0, 1.0,
            -1 * ratio.w, -1 * ratio.h, .0, .0,
            ratio.w, ratio.h, 1.0, 1.0,
            ratio.w, -1 * ratio.h, 1.0, .0
        ]),
        bSize = mixes.BYTES_PER_ELEMENT


    core.gl.bufferSubData(core.gl.ARRAY_BUFFER, 0, mixes)

    mat4.perspective(pMatrix, Math.PI / 6, w / h, 0, 100)
    core.uniformMatrix4fv(program, 'pMatrix', pMatrix)
})

