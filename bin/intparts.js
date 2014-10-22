#!/usr/bin/env node
"use strict";
var version = "0.0.1";
var intparts = (function(lib, env, heap) {
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

function get_option(opt){
    return options[opt];
}

var options = {
    getwords: 1, // default
    setwords: 2,
    getsign: 1,
    getexponent: 1,
    getlow: 1,
    setlow: 2,
    gethigh: 1,
    sethigh: 2,
    frexp: 1,
    ldexp: 2,
    h: 0,
    help: 0,
    v: 0,
    version: 0
};

var usage =
    "\n   intparts.js options [word] number\n" +
    "\n         Most output is in hexadecimal\n\n" +
    "--getwords         outputs comma separated words of input (default)\n" +
    "--setwords         builds a double from two words\n" +
    "--getsign          outputs the value of the sign bit of the input\n" +
    "--getexponent      outputs the value of the biased(!) exponent of the input\n" +
    "--getlow           outputs lower word of input\n" +
    "--setlow           sets lower word of input (order: word input)\n" +
    "--gethigh          outputs higher word of input\n" +
    "--sethigh          sets higher word of input (order: word input)\n" +
    "--frexp            output comma separated mantissa and exponent\n" +
    "--ldexp            builds a double from mantissa and exponent\n" +
    "--help, -h         this message\n" +
    "--version, -v      prints the version number\n";

var ip = intparts;

var argv = process.argv.slice(2);
var argc = argv.length;

var option, opt;
var value, arg;

var ret;

if (argc == 0) {
    console.log(usage);
    process.exit(1);
}

// handle default: just a number
if (argc === 1) {
    arg = argv[0];
    while (arg.charAt(0) == "-") {
        arg = arg.slice(1);
    }
    opt = get_option(arg);
    if (typeof opt === 'undefined') {
        opt = parseFloat(arg);
        if (isNaN(opt)) {
            console.log(usage);
            process.exit(1);
        }
        console.log("0x" + ip.getwords(opt)[0].toString(16) + "," + 
                    "0x" + ip.getwords(opt)[1].toString(16));
        process.exit(0);
    }
}

var arg_1, arg_2, arg_3, f_1 = false,
    f_2 = false,
    f_3 = false,
    numargs, number, func;

argv.forEach(function(o) {
    arg = o;
    while (arg.charAt(0) == "-") {
        arg = arg.slice(1);
    }
    opt = options[arg];
    if (typeof opt === 'undefined') {
        if(o[0] == "-"){
          arg = "-" + arg;
        }
        if (f_1 && f_2) {
            console.log("1"+usage);
            process.exit(1);
        } else if (!f_1 && !f_2 ) {
            if(arg.charAt(0) === "0" && arg.charAt(1) === "x") {
                  arg_1 = parseInt(arg);
            }
            else { arg_1 = parseFloat(arg);}
            if (isNaN(arg_1)) {
                console.log("2"+usage);
                process.exit(1);
            }
            f_1 = true;
        } else if (f_1 && !f_2) {
            if(arg.charAt(0) === "0" && arg.charAt(1) === "x") {
                  arg_2 = parseInt(arg);
            }
            else {arg_2 = parseFloat(arg);}
            if (isNaN(arg_2)) {
                process.exit(1);
            }
            f_2 = true;
        } 
    } else if (opt == 0) {
        if(arg[0] == "v"){
            console.log(version);
        } else {
            console.log("4"+usage);
        }
    } else {
        numargs = opt;
        func = arg;
    }
});

if (numargs == 1) {
    ret = eval("ip." + func + "(" + arg_1 + ")");
    if(func == "getwords") {
        console.log("0x" + ret[0].toString(16) + "," + "0x" + ret[1].toString(16));
    } else if (func == "frexp") {
        console.log(ret[0] + "," + ret[1]);
    } else {
        console.log("0x" + ret.toString(16));
    }
}
if (numargs == 2) {
    ret = eval("ip." + func + "(" + arg_1 + "," + arg_2 + ");");
        console.log(ret);
}

process.exit(0);
