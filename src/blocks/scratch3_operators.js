const Cast = require('../util/cast.js');
const MathUtil = require('../util/math-util.js');

class Scratch3OperatorsBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            operator_add: this.add,
            operator_subtract: this.subtract,
            operator_multiply: this.multiply,
            operator_divide: this.divide,
            operator_lt: this.lt,
            operator_equals: this.equals,
            operator_gt: this.gt,
            operator_and: this.and,
            operator_or: this.or,
            operator_not: this.not,
            operator_random: this.random,
            operator_join: this.join,
            operator_letter_of: this.letterOf,
            operator_length: this.length,
            operator_contains: this.contains,
            operator_mod: this.mod,
            operator_round: this.round,
            operator_mathop: this.mathop,
			operator_bool: (args) => {return args.VALUE},
			operator_identity: (args) => {return args.VALUE},
			operator_gtoreq: this.gtOrEq,
			operator_ltoreq: this.ltOrEq,
			operator_power: this.power,
			operator_identical: this.identical,
			operator_neg: this.neg,
			operator_unicodeof: this.unicodeOf,
			operator_unicodefrom: this.unicodeFrom,
			operator_true: () => {return true},
			operator_false: () => {return false},
			operator_xor: this.xor,
			operator_letters_of: this.lettersOf,
			operator_count: this.count,
			operator_split: this.split,
			operator_replace: this.replace,
			operator_indexof: this.indexOf,
			operator_repeat: this.repeat
        };
    }

    add (args) {
        return Cast.toNumber(args.NUM1) + Cast.toNumber(args.NUM2);
    }

    subtract (args) {
        return Cast.toNumber(args.NUM1) - Cast.toNumber(args.NUM2);
    }

    multiply (args) {
        return Cast.toNumber(args.NUM1) * Cast.toNumber(args.NUM2);
    }

    divide (args) {
        return Cast.toNumber(args.NUM1) / Cast.toNumber(args.NUM2);
    }

    lt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) < 0;
    }

    equals (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    gt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) > 0;
    }

    and (args) {
        return Cast.toBoolean(args.OPERAND1) && Cast.toBoolean(args.OPERAND2);
    }

    or (args) {
        return Cast.toBoolean(args.OPERAND1) || Cast.toBoolean(args.OPERAND2);
    }

    not (args) {
        return !Cast.toBoolean(args.OPERAND);
    }

    random (args) {
        return this._random(args.FROM, args.TO);
    }
    _random (from, to) { // used by compiler
        const nFrom = Cast.toNumber(from);
        const nTo = Cast.toNumber(to);
        const low = nFrom <= nTo ? nFrom : nTo;
        const high = nFrom <= nTo ? nTo : nFrom;
        if (low === high) return low;
        // If both arguments are ints, truncate the result to an int.
        if (Cast.isInt(from) && Cast.isInt(to)) {
            return low + Math.floor(Math.random() * ((high + 1) - low));
        }
        return (Math.random() * (high - low)) + low;
    }

    join (args) {
        return Cast.toString(args.STRING1) + Cast.toString(args.STRING2);
    }

    letterOf (args) {
        const index = Cast.toNumber(args.LETTER) - 1;
        const str = Cast.toString(args.STRING);
        // Out of bounds?
        if (index < 0 || index >= str.length) {
            return '';
        }
        return str.charAt(index);
    }

    length (args) {
        return Cast.toString(args.STRING).length;
    }

    contains (args) {
        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(args.STRING1).includes(format(args.STRING2));
    }

    mod (args) {
        const n = Cast.toNumber(args.NUM1);
        const modulus = Cast.toNumber(args.NUM2);
        let result = n % modulus;
        // Scratch mod uses floored division instead of truncated division.
        if (result / modulus < 0) result += modulus;
        return result;
    }

    round (args) {
        return Math.round(Cast.toNumber(args.NUM));
    }

    mathop (args) {
        const operator = Cast.toString(args.OPERATOR).toLowerCase();
        const n = Cast.toNumber(args.NUM);
        switch (operator) {
			case 'abs': return Math.abs(n);
			case 'floor': return Math.floor(n);
			case 'ceiling': return Math.ceil(n);
			case 'sqrt': return Math.sqrt(n);
			case 'sin': return Math.round(Math.sin((Math.PI * n) / 180) * 1e10) / 1e10;
			case 'cos': return Math.round(Math.cos((Math.PI * n) / 180) * 1e10) / 1e10;
			case 'tan': return MathUtil.tan(n);
			case 'asin': return (Math.asin(n) * 180) / Math.PI;
			case 'acos': return (Math.acos(n) * 180) / Math.PI;
			case 'atan': return (Math.atan(n) * 180) / Math.PI;
			case 'ln': return Math.log(n);
			case 'log': return Math.log(n) / Math.LN10;
			case 'e ^': return Math.exp(n);
			case '10 ^': return Math.pow(10, n);
			// Add 0 to prevent -0 as output when inputting -0
			case 'sign': return Math.sign(n) + 0;
        }
        return 0;
    }
	
	gtOrEq (args, util) {
		return Cast.compare(args.OPERAND1, args.OPERAND2) >= 0;
	}
	
	ltOrEq (args, util) {
		return Cast.compare(args.OPERAND1, args.OPERAND2) <= 0;
	}
	
	power (args, util) {
		const num1 = Cast.toNumber(args.NUM1);
		const num2 = Cast.toNumber(args.NUM2);
		return Math.pow(num1, num2);
	}
	
	identical (args, util) {
		// Purposefully no casting, because
		// types ARE differentiated in this block
		return args.OPERAND1 === args.OPERAND2
	}
	
	neg (args, util) {
		return -Cast.toNumber(args.NUM);
	}
	
	unicodeOf (args, util) {
		const chars = Array.from(Cast.toString(args.STRING));
		return chars.map((char) => {return char.charCodeAt(0)}).join(" ");
	}
	
	unicodeFrom (args, util) {
		return String.fromCharCode(Cast.toNumber(args.NUM));
	}
	
	xor (args, util) {
		return (Cast.toBoolean(args.OPERAND1) + Cast.toBoolean(args.OPERAND2)) === 1;
	}
	
	lettersOf (args, util) {
		args.STRING = Cast.toString(args.STRING);
		args.LETTER1 = Cast.toNumber(args.LETTER1);
		args.LETTER2 = Cast.toNumber(args.LETTER2);
		return args.STRING.substring(args.LETTER1 - 1, args.LETTER2);
	}
	
	count (args, util) {
		//.toLowerCase() for case insensitivity
		args.STRING = Cast.toString(args.STRING).toLowerCase();
		args.SUBSTRING = Cast.toString(args.SUBSTRING).toLowerCase();
		
		return args.STRING.split(args.SUBSTRING).length - 1;
	}
	
	split (args, util) {
		// .toLowerCase() for case insensitivity
		args.STRING = Cast.toString(args.STRING).toLowerCase();
		args.SPLIT = Cast.toString(args.SPLIT).toLowerCase();
				
		const split = args.STRING.split(args.SPLIT);
		args.ITEM = Cast.toListIndex(args.ITEM, split.length, false);
		
		if (args.ITEM === Cast.LIST_INVALID) {
			return '';
		}
		return split[args.ITEM - 1];
		
	}
	
	replace (args, util) {
		args.STRING = Cast.toString(args.STRING);
		args.SUBSTRING = Cast.toString(args.SUBSTRING);
		
		args.REPLACE = Cast.toString(args.REPLACE);
		
		return args.STRING.replaceAll(args.SUBSTRING, args.REPLACE);
	}
	
	indexOf (args, util) {
		// .toLowerCase() for case insensitivity
		args.STRING = Cast.toString(args.STRING).toLowerCase();
		args.SUBSTRING = Cast.toString(args.SUBSTRING).toLowerCase();
		
		// Since both arguments are casted to strings beforehand,
		// we dpm't have to worry about type differences
		// like in the item number of in list block.
		const found = args.STRING.indexOf(args.SUBSTRING);
		
		// indexOf returns -1 when no matches are found
		return found === -1 ? 0 : found + 1;
	}
	
	repeat (args, util) {
		args.STRING = Cast.toString(args.STRING);
		args.REPEAT = Cast.toNumber(args.REPEAT);
		return args.STRING.repeat(args.REPEAT);
	}
}

module.exports = Scratch3OperatorsBlocks;
