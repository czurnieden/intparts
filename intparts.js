var intparts = (function(lib, env, heap) {
    "use strict";
    "use asm";
    var HEAPU32 = new lib.Uint32Array(heap);
    var HEAPD64 = new lib.Float64Array(heap);

    function getSignBit(x) {
        var high = 0 >>> 0;
        HEAPD64[0] = x;
        high = HEAPU32[1];
        return (high & 0x80000000) >>> 31;
    }

    function getExponent(x) {
        var high = 0 >>> 0;
        HEAPD64[0] = x;
        high = HEAPU32[1];
        return (high & 0x7ff00000) >>> 20;
    }

    function getWords(x) {
        HEAPD64[0] = x;
        return HEAPU32;
    }

    function setWords(x, high, low) {
        HEAPD64[0] = x;
        HEAPU32[0] = low;
        HEAPU32[1] = high;
        return HEAPD64[0];
    }

    function getLowWord(x) {
        HEAPD64[0] = x;
        return HEAPU32[0];
    }

    function setLowWord(anUint32,x) {
        HEAPD64[0] = x;
        HEAPU32[0] = anUint32 >>> 0;
        return HEAPD64[0];
    }

    function getHighWord(x) {
        HEAPD64[0] = x;
        return HEAPU32[1];
    }

    function setHighWord(anUint32,x) {
        HEAPD64[0] = x;
        HEAPU32[1] = anUint32 >>> 0;
        return HEAPD64[0];
    }

    function frexp(x) {
        var high = 0 >>> 0,
            tmp = 0 >>> 0,
            low = 0 >>> 0;
        var exp = 0 | 0;
        var tmpd = 0.0;
        HEAPD64[0] = x;
        if (x === 0) {
            return x;
        }
        high = HEAPU32[1];
        low = HEAPU32[0];
        tmp = 0x7fffffff & high;
        if (tmp >= 0x7ff00000 || ((tmp | low) === 0)) {
            return x;
        }
        if (tmp < 0x00100000) {
            tmpd = HEAPD64[0];
            tmpd *= 18014398509481984.0;
            HEAPD64[0] = tmpd;

            high = HEAPU32[1];
            tmp = high & 0x7fffffff;
            exp = -54;
        }
        exp += (tmp >>> 20) - 1022;
        high = (high & 0x800fffff) | 0x3fe00000;
        HEAPU32[1] = high;
        HEAPD64[1] = exp * 1.0;
        return HEAPD64;
    }

    function ldexp(mantissa, exponent) {
        var k = 0 >>> 0,
            hx = 0 >>> 0,
            lx = 0 >>> 0;
        var sign = 0 | 0;
        var tmpd = 0.0;
        HEAPD64[0] = mantissa;
        hx = HEAPU32[1];
        lx = HEAPU32[0];
        k = (hx & 0x7ff00000) >>> 20;
        if (k === 0) {
            if ((lx | (hx & 0x7fffffff)) === 0) {
                return mantissa;
            }
            tmpd = HEAPD64[0];
            tmpd *= 18014398509481984.0;
            HEAPD64[0] = tmpd;

            hx = HEAPU32[1];
            k = ((hx & 0x7ff00000) >>> 20) - 54;
        }
        if (k === 0x7ff) {
            return (2 * HEAPD64[0]);
        }
        k = k + exponent;
        sign = (mantissa < 0) ? -1 : 1;
        if (k > 0x7fe) {
            return 1.0e+300 * sign;
        }
        if (exponent < -50000) {
            return 1.0e-300 * sign;
        }
        if (k > 0) {
            hx = (hx & 0x800fffff) | (k << 20);
            HEAPU32[1] = hx;
            return HEAPD64[0];
        }
        if (k <= -54) {
            if (exponent > 50000) {
                return 1.0e+300 * sign;
            }
            return 1.0e-300 * sign;
        }
        k += 54;
        hx = (hx & 0x800fffff) | (k << 20);
        HEAPU32[1] = hx;
        return (HEAPD64[0] * 5.55111512312578270212e-17 * sign);
    }
    return {
        getsign: getSignBit,
        getexponent: getExponent,
        getwords: getWords,
        setwords: setWords,
        getlow: getLowWord,
        setlow: setLowWord,
        gethigh: getHighWord,
        sethigh: setHighWord,
        frexp: frexp,
        ldexp: ldexp
    };
})({
        "Uint32Array": Uint32Array,
        "Float64Array": Float64Array
    }, {}, (new ArrayBuffer(16)) // 1x 64 bit double + 1x 32 bit signed for frexp
);


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = intparts;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() { return intparts; });
    } else {
         window.primesieve = intparts;
    }
}
