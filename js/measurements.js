/** All measurements are stored in px for ease of use, converters are used to switch around
 * The internals of the program call 1 point 1 pixel. So, we really store stuff in points too lol.
 * */

const PX_PER_POINT = 1 // I just decided this to be true for this program
const PX_PER_INCH = PX_PER_POINT * 72
const PX_PER_MM = PX_PER_INCH / 254

const toPxConverters = {
    px: (px) => px,
    point: (points) => points,
    inch: (inches) => inches * 72,
    millimeter: (mm) => mm * PX_PER_MM,
}

const fromPxConverters = {
    px: (px) => px,
    point: (px) => px,
    inch: (px) => px / 72,
    millimeter: (px) => px / PX_PER_MM,
}

const abbreviations = {
    px: 'px',
    pixel: 'px',
    pixels: 'px',

    point: 'point',
    points: 'point',
    pt: 'point',

    millimeter: 'millimeter',
    millimeters: 'millimeter',
    mm: 'millimeter',

    inch: 'inch',
    in: 'inch',
    inches: 'inch',
}

const epsilon = 0.0001

export const convert = (value, fromType, toType) => {
    const _ToPxFn = toPxConverters[abbreviations[fromType]]
    const pxTo_Fn = fromPxConverters[abbreviations[toType]]

    const _ToPx = _ToPxFn(value)
    const pxTo_ = pxTo_Fn(_ToPx)

    // Round

    console.log(`${value} ${fromType} -> ${_ToPx} px -> ${pxTo_} ${toType}`)

    return pxTo_Fn(_ToPxFn(value))
}

// Assumed portrait
export const measurements = {
    a5: {
        width: toPxConverters.point(420),
        height: toPxConverters.point(595),
    },
    a4: {
        width: toPxConverters.point(595),
        height: toPxConverters.point(840),
    },
}
