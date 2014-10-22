var vows = require('vows');
var assert = require('assert');

var p = require('./intparts');

vows.describe('Primesieve').addBatch({
  "Sign, positive" : {
       topic: p.getsign(123.321),
       "is positive" :  function (x) {
            assert.equal (x,0);
        }
   },
  "Sign, negative" : {
       topic: p.getsign(-123.321),
       "is negative" :  function (x) {
            assert.equal (x,1);
        }
   },
  "Exponent, positive" : {
       topic: p.getexponent(1e-123),
       "is negative" :  function (x) {
            assert.equal (x,0x266);
        }
   },
  "Exponent, negative" : {
       topic: p.getexponent(123.321),
       "is negative" :  function (x) {
            assert.equal (x,0x405);
        }
   }, 
  "Get words" : {
       topic: p.getwords(123.321),
       "high word" :  function (x) {
            assert.equal (x[1],0x405ed48b);
        },
       "low word" :  function (x) {
            assert.equal (x[0],0x43958106);
        },
   }, 
  "Set words" : {
       topic: p.setwords(0x43958106,0x405ed48b),
       "double" :  function (x) {
            assert.equal (x,123.32098388671875);
        }
   },
  "Get low" : {
       topic: p.getlow(123.321),
       "low word" :  function (x) {
            assert.equal (x,0x43958106);
        },
   }, 
  "Set low" : {
       topic: p.setlow(0xffffffff,123.321),
       "double" :  function (x) {
            assert.equal (x,123.32104492187499);
        },
   }, 
  "Get high" : {
       topic: p.gethigh(123.321),
       "high word" :  function (x) {
            assert.equal (x,0x405ed48b);
        }
   },
  "Set high" : {
       topic: p.sethigh(0x33333333,123.321),
       "double" :  function (x) {
            assert.equal (x,4.66726169578505e-62);
        }
   },
  "frexp" : {
       topic: [p.frexp(123.321)[0],p.frexp(123.321)[1]],
       "mantissa" :  function (x) {
            assert.equal (x[0],0.9634453125);
        },
       "exponent" :  function (x) {
            assert.equal (x[1],7);
        }
   },
  "ldexp" : {
       topic: p.ldexp(0.9634453125,7),
       "double" :  function (x) {
            assert.equal (x,123.321);
        }
   }
}).export(module);
