import {mat4, vec2} from 'gl-matrix'
import * as core from '../core/index'
import vs from '../shaders/texture.vert'
import fs from '../shaders/texture.frag'
import player from '../static/textures/player.png'

const {drawingBufferWidth: width, drawingBufferHeight: height} = core.gl

const program = core.compile(vs, fs)

/*
* 为什么需要这个矩阵？
* WebGL 坐标系是 -1 -> 1
* 直接传入屏幕坐标需要这个转换(如果传入的顶点不是屏幕坐标则不需要)
* 详见：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html
*/
core.uniformMatrix4fv(program, 'uMatrix', new Float32Array([
    2 / width, 0, 0, 0,
    0, -2 / height, 0, 0,
    0, 0, 1, 0,
    -1, 1, 0, 1
]))

const img = new Image()
img.onload = function() {
    const
        mixes = new Float32Array([
            0, 0, 0, 1,
            0, 100, 0, 0,
            100, 0, 1, 1,
            100, 100, 1, 0,
        ]),
        bSize = mixes.BYTES_PER_ELEMENT

    core.createBuffer(core.gl.ARRAY_BUFFER, mixes)
    core.vertexAttribPointer(program, 'aPosition', 2, core.gl.FLOAT, false, bSize * 4, 0)
    core.vertexAttribPointer(program, 'aCoord', 2, core.gl.FLOAT, false, bSize * 4, bSize * 2)
    core.createTexture(img)
    core.gl.uniform1i(core.gl.getUniformLocation(program, 'uSampler'), 0)
    core.clear(0xffffff, 1)
    core.gl.drawArrays(core.gl.TRIANGLE_STRIP, 0, 4)
}

img.src = player

window.addEventListener('resize', ev => {
    const
        canvas = core.gl.canvas,
        {offsetWidth: width, offsetHeight: height} = canvas

    canvas.width = width
    canvas.height = height
    core.gl.viewport(0, 0, width, height)
    core.uniformMatrix4fv(program, 'uMatrix', new Float32Array([
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1
    ]))
    core.clear(0xffffff, 1)
    core.gl.drawArrays(core.gl.TRIANGLE_STRIP, 0, 4)
})
