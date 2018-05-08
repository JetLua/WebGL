function hex2rgb(hex:number, out?:Array<number>) : Array<number> {
    out = out || []
    out[0] = ((hex >> 16) & 0xFF) / 255
    out[1] = ((hex >> 8) & 0xFF) / 255
    out[2] = (hex & 0xFF) / 255
    return out
}

export {
    hex2rgb
}