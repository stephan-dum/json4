var json4 = (function() {
	"use strict";

	function json(input) {
		var charCode;
		
		do {
			charCode = input.charCodeAt(this.index++);
		} while(charCode <= 32)
		
		if(charCode == 91) { // [
			while((charCode = input.charCodeAt(this.index)) <= 32) {
				this.index++;
			}
			
			if(charCode == 93) {
				this.index++;
				return [];
			}
			
			var result = [];
			
			do {
				result.push(json.call(this, input));

				do {
					charCode = input.charCodeAt(this.index++);
				} while(charCode <= 32)
			} while(charCode == 44); //,

			if(charCode == 93) { // ]
				return result;
			}
		} else if(charCode == 123) { // {
			while((charCode = input.charCodeAt(this.index)) <= 32) {
				this.index++;
			}

			if(charCode == 125) { // }
				this.index++;
				return {};
			}
			
			var result = {};
			var id, start, tmp;
			
			do {
				while((charCode = input.charCodeAt(this.index)) <= 32) {
					this.index++;
				}

				if(charCode != 34) { // "
					throw new SyntaxError("Illegal character expected '\"' at index "+this.index+"!");
				}

				start = this.index;
			
				do {
					this.index = input.indexOf('"', this.index+1);
					for(tmp = 1; input.charCodeAt(this.index-tmp) == 92; tmp++) {}
				} while(tmp%2==0)
				
				if(this.index == -1) {
					throw new SyntaxError("Unterminated string literal!");
				}
				
				id = input.slice(start+1, this.index++).replace('\\"', '"');
				
				
				do {
					charCode = input.charCodeAt(this.index++);
				} while(charCode <= 32)
				
				if(charCode != 58) { // :
					throw new SyntaxError("Illegal character expecting ':' at index "+this.index+"!");
				}
				
				result[id] = json.call(this, input);
				
				do {
					charCode = input.charCodeAt(this.index++);
				} while(charCode <= 32)
			} while(charCode == 44); // ,
			
			if(charCode == 125) { // }
				return result;
			}
		} else if(charCode >= 48 && charCode <= 57 || charCode == 43 || charCode == 45) { //digit
			var start = this.index-1;
			
			if(charCode == 43 || charCode == 45) { //+ -
				charCode = input.charCodeAt(++this.index);
			}
				
			while((charCode = input.charCodeAt(this.index)) >= 48 && charCode <= 57) {
				this.index++;
			}
			
			if(charCode == 46) { //.
				do {
					charCode = input.charCodeAt(++this.index);
				} while(charCode >= 48 && charCode <= 57)
			}
			if(charCode == 69 || charCode == 101) { //e E
				charCode = input.charCodeAt(++this.index);
				if(charCode == 43 || charCode == 45) { //+ -
					charCode = input.charCodeAt(++this.index);
				}
				
				if(charCode >= 48 && charCode <= 57) {
					do {
						charCode = input.charCodeAt(++this.index);
					} while(charCode >= 48 && charCode <= 57)
				} else {
					throw SyntaxError("Missing exponent at index "+this.index+"");
				}
			}

			return parseFloat(input.slice(start, this.index));
		} else if(charCode == 34) { // "
			var start = this.index-1;
			
			do {
				this.index = input.indexOf('"', this.index+1);
				for(tmp = 1; input.charCodeAt(this.index-tmp) == 92; tmp++) {}
			} while(tmp%2==0)
			
			if(this.index == -1) {
				throw new SyntaxError("Unterminated string literal!");
			}
			
			return input.slice(start+1, this.index++).replace('\\"', '"');
		} else if(charCode == 110) { //n
			if(input.charCodeAt(this.index++) == 117) {
				if(input.charCodeAt(this.index++) == 108) {
					if(input.charCodeAt(this.index++) == 108) {
						return null;
					}
				}
			}
		} else if(charCode == 102) { //f
			if(input.charCodeAt(this.index++) == 97) {
				if(input.charCodeAt(this.index++) == 108) {
					if(input.charCodeAt(this.index++) == 115) {
						if(input.charCodeAt(this.index++) == 101) {
							return false;
						}
					}
				}
			}
		} else if(charCode == 116) { //t
			if(input.charCodeAt(this.index++) == 114) {
				if(input.charCodeAt(this.index++) == 117) {
					if(input.charCodeAt(this.index++) == 101) {
						return true;
					}
				}
			}
		}
		
		throw new SyntaxError("Unexpected character '"+input[this.index]+"' at index "+this.index+"!");
	}
	return function(input) {
		return json.call({index : 0}, input);
	}
})();
