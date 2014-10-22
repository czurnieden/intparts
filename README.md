#intparts

Manipulate the integer parts of a JS Number, including `frexp` and `ldexp`.

##Author(s)
Christoph Zurnieden <czurnieden@gmx.de>

##Installation

```shell
$ git clone https://github.com/czurnieden/intparts.git
$ cd intparts
$ npm install -g
```
There is also a Unix (or newer Macs) dependent CLI version in `./bin`.

Please be aware that this module assumes little endian.

##Version

0.0.1 Initial publication

##Description

This library implements some of the functions to inspect the innards of a 64 bit `double`, the default type in ECMAScript up to version 5.1 at least. It allows direct manipulation of the bits in a `Number`. Included are ports of C-lib's `frexp` and `ldexp`.

This module runs as ams.js where applicable.

##Usage

The usage is like with any other node/browser module:
```javascript
var ip = require('intparts');
var raw_exponent = ip.getexponent(123.312); // 0x405
var unbiased_exponent = ip.frexp(123.321)[1]; // 7
```

This program offers ten functions which are in alphabetical order:

<dl>
<dt><code>frexp(number)</code> </dt><dd>
Return: an <code>Uint32Array</code> containing the mantissa and the exponent in that order such that <code>mantissa * 2^exponent = number</code> 
</dd>
<dt><code>getexponent(number)</code> </dt><dd>
Return: the biased, raw exponent in hexadecimal representation
 </dd>
<dt><code>gethigh(number)</code> </dt><dd>
Return: the high word in hexadecimal representation
 </dd>
<dt><code>getlow(number)</code> </dt><dd>
Return: the low word in hexadecimal representation
 </dd>
<dt><code>getsign(number)</code> </dt><dd>
Return: the sign bit in hexadecimal representation
 </dd>
<dt><code>getwords(number)</code> </dt><dd>
Return: the comma separated low and high words in hexadecimal representation and in that order
 </dd>
<dt><code>ldexp(mantissa,exponent)</code> </dt><dd>
Return: a number such that <code>mantissa * 2^exponent = number</code>
 </dd>
<dt><code>sethigh(integer,number)</code> </dt><dd>
Sets the high word of <code>number</code><br><br>

Return: the manipulated number
 </dd>
<dt><code>setlow(integer,number)</code> </dt><dd>
Sets the high word of <code>number</code><br><br>

Return: the manipulated number
 </dd>
<dt><code>setwords(number,high_integer,low_integer)</code> </dt><dd> 
Sets the words of <code>number</code><br><br>

Return: the manipulated number
</dd>
</dl>

This module does no error catching.

##Example

No example yet, but ideas are welcome.

