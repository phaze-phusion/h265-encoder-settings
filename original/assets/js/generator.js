
(function($) {

    "use strict";

    window._generator = {};

    /*
     * Number Cleanser
     *
     * @param {mixed} n Number to clean-up
     * @returns {intger} Cleansed number
     */
    function cleanNumber(n){n=parseFloat((''+n).replace(/[^\d\.\-]/g,''));return isNaN(n)?0:n;};

    /*
     * Convert text to numbers and boolean strings to boolean value
     *
     * @param {string} t String to convert
     * @returns {intger|boolean|string}
     */
    function parseValue(t){
        if( t === 'true' )
        	return true;
        else if( t === 'false' )
        	return false;
        else
        	return isNaN(t) ? t : cleanNumber(t);
    };

    class Element {
        constructor( id ) {
            this.el = this.id = id;

            let dash = id.indexOf('-');

            if( dash !== -1 ) {
                this._prefix = id.substr(0, dash);
                this._suffix = id.substr(dash + 1);
            } else {
                this._prefix = id;
                this._suffix = undefined;
            }
        };

        set el( id ) {
            this._element = document.getElementById( id );
        }
        get el() {
            return this._element;
        }
    }

    class Input extends Element {
        constructor( id ) {
            super( id );

            this.type = this._element.type || 'text';
            this.value = this._element[ this.elementValueProperty() ];
            this.listen();
        };

        listen(){
            let inp = this;
            $( inp.el ).on('keyup change', function(){
                inp.value = inp._element[ inp.elementValueProperty() ];
                $( '#' + inp._prefix ).trigger( inp._prefix + '.updated' );
            });
        }

        elementValueProperty(){
            return 'value';
        }

        set value( val ) {
            this._value = this._element.value = val;
        }
        get value() {
            return this._value;
        }
    }

    class Textarea extends Input {
        constructor( id ){
            super( id );
            this.type = 'textarea';
        }

        set value( val ){
            this._value = this._element.value = val;
        }
        get value() {
            return this._value;
        }
    }

    class RadioInput extends Input {
        constructor( id ) {
            super( id );
            this.group = this._element.name;
        }

        elementValueProperty(){
            return 'checked';
        }

        set value( val ) {
            this._value = this._element.checked = ( val == true );
        };
        get value() {
            return this._value;
        };
    }

    class RadioGroup{
        constructor( prefix, suffixes ) {
            this.id = prefix;
            this.name = this.id + '-radio';
            this._length = suffixes.length;
            this._radios = [];
            this._element = document.getElementById( this.id );

            for( let i = 0; i < this._length; i++ )
                this._radios.push( new RadioInput( this.id + '-' + suffixes[i] ) );

            this.value = null;
            this.listen();
        }

        listen(){
            let row = this;
            $( '#' + row.id ).on( row.id + '.updated' , function( event ){
                row.value = null;
                _generator.machine();
            });
        }

        highlightActive(){
               for( let r = 0; r < this._length; r++ ){
                   let $radio = $(this._radios[r]._element),
                    $btn = $radio.parent();
                if( $radio.is(':checked') ) {
                    $btn.addClass('btn-primary active').removeClass('btn-secondary');
                } else {
                    $btn.removeClass('active btn-primary').addClass('btn-secondary');
                }
               }
        }

        set value( val ) {
            this.highlightActive();
            this._value = $('input[name="' + this.name + '"]:checked').val();
        };
        get value() {
            return this._value;
        };
    }

    /*
     * Unite properties of one object with another object (Union of Sets)
     * 
     * @param {object}  presetDefaults     Object with properties that will be the default values
     * @param {object}  incomingProperties Object with properties that will change the default when specified
     * @param {boolean} discardAdditional  Properties in incomingProperties that are not in presetDefaults will be discarded
     *
     * @return {object}
     */
    function uniteObjects(presetDefaults, incomingProperties, discardAdditional = true ) {
        if( discardAdditional ) {
            //Return all properties of presetDefaults only
            for(let property in presetDefaults)
                if( typeof incomingProperties[ property ] !== 'undefined' ) presetDefaults[ property ] = incomingProperties[ property ];
            return presetDefaults;

        } else {
              //Return all properties of presetDefaults as well as any others from incomingProperties 
            for(let property in presetDefaults)
                if( typeof incomingProperties[ property ] === 'undefined' ) incomingProperties[ property ] = presetDefaults[ property ];
            return incomingProperties;
        }
    }

    /*
     * Intersect properties of one object with another object (Intersection of Sets)
     * 
     * @param {object}  presetDefaults     Object with properties that will be the default values
     * @param {object}  incomingProperties Object with properties that will change the default when specified
     *
     * @return {object}
     */
    function intersectObjects(presetDefaults, incomingProperties ) {
        let emptyObject = {},
        	logSkippedOptions = false,
        	padString;

        // Sometimes it may miss a few options, this is to debug that list
        if( logSkippedOptions ) {
        	padString = function ( str, emptyPaddedValue = '                  :' ) {
        	if( str.length >= emptyPaddedValue.length )
				return str;
			else
			    return String( str + emptyPaddedValue.substr(str.length, emptyPaddedValue.length) );
			};
        }

        for( let property in incomingProperties )
            if( typeof presetDefaults[ property ] !== 'undefined' ) {
                if( incomingProperties[ property ] !== presetDefaults[ property ] )
                    emptyObject[ property ] = incomingProperties[ property ];
                else if( logSkippedOptions )
                	console.log( padString( property ), presetDefaults[ property ] );
            } 
        return emptyObject;
    }

    /**
     * Convert Media Info string to Object
     *
     * @param {string} text The string to convert
     *
     * @return {object}
     */
    function mediaInfo2object( text ){
        let sections = text.split('/'),
            sLen     = sections.length,
            options  = {};

        for ( let s = 0; s < sLen; s++ ) {
            sections[s] = sections[s].trim();
            if( sections[s].length === 0 )
                continue;

            if( sections[s].indexOf('=') !== -1 ) {
                let property = sections[s].split('=');
                options[ property[0] ] = parseValue( property[1] );
            }
            else if ( sections[s].substr(0, 3) === 'no-' ){
                options[ sections[s].substr(3) ] = false;
            }
            else {
                options[ sections[s] ] = true;
            }
        }

        return options;
    }

    /**
     * Convert CLI option string to Object
     *
     * @param {string} text The string to convert
     *
     * @return {object}
     */
    function cli2object( text ){
        let sections = text.split('--'),
            sLen     = sections.length,
            options  = {};

        for ( let s = 0; s < sLen; s++ ) {
            sections[s] = sections[s].trim();
            if( sections[s].length === 0 )
                continue;

            if( sections[s].indexOf(' ') !== -1 ) {
                let property = sections[s].split(' ');
                options[ property[0] ] = parseValue( property[1] );
            }
            else if ( sections[s].substr(0, 3) === 'no-' ){
                options[ sections[s].substr(3) ] = false;
            }
            else {
                options[ sections[s] ] = true;
            }
        }

        return options;
    }

    /**
     * Convert CLI option string to Object
     *
     * @param {string} text The string to convert
     * @param {string} splitter The string used as a divider between the options
     * @param {string} equal The string used as a divider between the options and its value
     *
     * @return {object}
     */
    function input2object( text, splitter, equal ){
        let sections = text.split( splitter ),
            sLen     = sections.length,
            options  = {};

        for ( let s = 0; s < sLen; s++ ) {
            sections[s] = sections[s].trim();
            if( sections[s].length === 0 )
                continue;

            let sub3isNo = sections[s].substr(0, 3) === 'no-',
                hasEqual = sections[s].indexOf( equal ) !== -1;

            if ( sub3isNo && hasEqual ){
                // This caters for HandBrake weirdness where one disables a property like no-rect=1
                let property = sections[s].split( equal );
                options[ property[0].substr(3) ] = parseValue( property[1] ) !== 1;
            }
            else if( hasEqual ) {
                let property = sections[s].split( equal );
                options[ property[0] ] = parseValue( property[1] );
            }
            else if ( sub3isNo ){
                options[ sections[s].substr(3) ] = false;
            }
            else {
                options[ sections[s] ] = true;
            }
        }

        return options;
    }

    /**
     * Convert ME value
     *
     * @param {integer|string} i The value that will possibly be converted
     * @param {boolean} return_number = true If true return a number, else return a string
     *
     * @return {integer|string}
     */
    function meConversion( i, return_number = true ) {
        if( isNaN(i) ) {
            if( return_number ) {
                switch ( i ) {
                    case 'dia' : return 0; break;
                    case 'umh' : return 2; break;
                    case 'star': return 3; break;
                    case 'sea' : return 4; break;
                    case 'full': return 5; break;
                    case 'hex' :
                    default: return 1;
                }
            } else {
                return i;
            }
        } else {
            if ( return_number ) {
                return i;
            } else {
                switch ( i ) {
                    case 0: return 'dia' ; break;
                    case 2: return 'umh' ; break;
                    case 3: return 'star'; break;
                    case 4: return 'sea' ; break;
                    case 5: return 'full'; break;
                    case 1:
                    default: return 'hex';
                }
            }
        }
    }

    function specialCasesFormats( prop, val ){
        let booleanObject = { v: val, t: 'boolean'},
            stringObject  = { v: val, t: 'string' },
            numberObject  = { v: val, t: 'number' },
            nullObject    = { v: null,t: 'null'   };

        switch ( prop ) {
            case 'profile' :
                return stringObject;
                break;
            case 'scenecut' :
                if( val === true || val === false || val === 0 )
                    return booleanObject;
                else
                    return numberObject;
                break;
            case 'deblock' :
                if( val === false )
                    return booleanObject;
                else if( _generator.outformat.value === 'handbrake' ){
                    if( val.indexOf(':') !== -1 )
                        return { v: val.replace(':', ','), t: 'string' };
                    else if( val === 0 || val === 1 || val === true )
                        return booleanObject;
                    else
                        return stringObject;
                }
                else if( val === 0 || val === 1 || val === true )
                    return { v: '0:0', t: 'string' };
                else //if( ( val + '' ).indexOf(':') !== -1 )
                    return stringObject;
                break;
            case 'interlace' :
                if( val === false )
                    return booleanObject;
                else if ( val === 'tff' || val === 'bff' )
                    return stringObject;
                else
                    return numberObject;
                break;
            case 'level-idc' :
                val = parseFloat( val );
                if( val > 10 )
                    val /= 10;
                return numberObject;
                break;
            case 'pass' :
            	if( val === 1 ||  val === 2 || val === 3)
                    return numberObject;
                else
                    return nullObject;
                break;
            case 'vbv-bufsize':
            case 'vbv-maxrate':
            	if( val === false )
            		return nullObject;
            	else
            		return numberObject;
            	break;
            case 'asm' :
                if( val === false )
                    return booleanObject;
                else if ( isNaN( val ) )
                    return stringObject;
                else
                    return nullObject;
                break;
            case 'annexb' :
                if( _generator.outformat.value === 'handbrake' )
                    return val ? booleanObject : nullObject;
                else
                    return booleanObject;
                break;
            case 'scenecut-bias':
                val = ( val < 0 ) ? val * 100 : val;
                return { v: val, t: 'number' }
                break;
            case 'chromaloc':
            case 'numa-pools':
            case 'sar':
                return ( (val + '').length > 0 ) ? stringObject : nullObject;
                break;
            case 'max-cll' :
                return ( val === '0,0' || val === 0 ) ? nullObject : stringObject;
                break;
            case 'range' :
                return ( val === 'full' || val === 'limited' ) ? stringObject : nullObject;
                break;
            case 'overscan' :
                return ( val === 'show' || val === 'crop' ) ? stringObject : nullObject;
                break;
            case 'dither' :
            case 'uhd-bd' :
                return ( val === true ) ? booleanObject : nullObject;
            case 'hash':
            case 'zone-count' :
                return ( val === 0 || val === false ) ? nullObject : numberObject;
                break;
            case 'dhdr10-opt' :
                return ( val === true ) ? booleanObject : nullObject;
                break;
            case 'display-window' :
            case 'zones' :
            default :
                return nullObject;
        }
    }

    // function numericStringCasesFormats( prop, val ){
    //     return isNaN( val ) ? 'string' : 'number';
    // }

    function addRemoveOptions( options ){
    	let crf_or_2pass = typeof options['crf'] !== 'undefined' ? 'crf' : '2pass';


    	// Add base options in order to not change it with the following steps
    	if( _generator.baseset.value !== 'none' ) {
    		let basers = {};

    		// duplicate the options
    		for( let o in window.h265_arguments.base[_generator.baseset.value] )
    			basers[ o ] = window.h265_arguments.base[_generator.baseset.value][ o ];

        	basers['vbv-bufsize'] = basers['vbv-bufsize'][crf_or_2pass];
        	basers['vbv-maxrate'] = basers['vbv-maxrate'][crf_or_2pass];

        	options = uniteObjects( basers, options, true );
    	}

        // Create a intersect set with the selected options
        if( _generator.removeset.value !== 'none' ) {
        	let intersectors = {},
        		setname =_generator.removeset.value;

    		// duplicate the 'base' options for the chosen set
    		for( let o in window.h265_arguments.base[setname] )
    			intersectors[ o ] = window.h265_arguments.base[setname][ o ];

    		// add the 'remove' options
    		for( let i in window.h265_arguments.remove[setname] )
    			intersectors[ i ] = window.h265_arguments.remove[setname][ i ];

    		//console.log('vbv-bufsize',intersectors['vbv-bufsize']);

        	intersectors['vbv-bufsize'] = intersectors['vbv-bufsize'][crf_or_2pass];
        	intersectors['vbv-maxrate'] = intersectors['vbv-maxrate'][crf_or_2pass];

        	options = intersectObjects( intersectors, options );
        }

        return options;
    }

    function sorter( optionsArray ) {
        let theOrder = [],
        	temp     = [],
            sorted   = [];

        if(_generator.outorder.value === 'mediainfo')
            theOrder = window.h265_arguments.order.mediainfo;
        else if(_generator.outorder.value === 'staxrip')
            theOrder = window.h265_arguments.order.staxrip;
        else { //if(_generator.outorder.value === 'none')
        	return optionsArray;
        }

        for( let o = 0, l = optionsArray.length, p = l + 1; o < l; o++, p++ ) {
        	let option = optionsArray[o].name,
        		index = theOrder.indexOf( option );

        	if( index !== -1 )
                temp[ index ] = optionsArray[o];
            else
            	temp[ p ] = optionsArray[o];
        }

        temp = temp.map(function(el, i){
        	sorted.push( el );
        	return el;
        });

        return sorted;
    }

    function formatIncomingValues( options ) {
    	if( typeof options['level-idc'] !== 'undefined' ) {
    		options['level-idc'] = parseFloat( options['level-idc'] );
            if( options['level-idc'] > 10 )
                options['level-idc'] /= 10;
    	}
    	return options;
    }

    function outputFormatter( optionsArray ) {
        let signage, _divider;
        
        if(_generator.outformat.value === 'handbrake') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' ) {
                    val = ( val === true || val === 1 || val === 'true')
                    return val ? prop : 'no-' + prop + '=1';
                }
                return prop + '=' + val;
            }
            _divider = ':';
        }
        else if(_generator.outformat.value === 'json') {
            signage = function( prop, val, valtype ) {
                prop = '"' + prop + '"';

                if ( valtype === 'boolean' || valtype === 'number' )
                    return prop + ':' + val;

                return prop + ':' + '"' + val + '"';
            }
            _divider = ',';
        }
        else if(_generator.outformat.value === 'tab') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' )
                    val = val ? 'TRUE' : 'FALSE';

                return prop + "\t" + val;
            }
            _divider = "\n";
        }
        else if(_generator.outformat.value === 'mediainfo') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' )
                    return  val ? prop : 'no-' + prop;
                return prop + '=' + val;
            }
            _divider = ' / ';
        }
        else { //if(_generator.outformat.value === 'cli') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' )
                    return '--' + ( val ? prop : 'no-' + prop );
                else if ( valtype === 'number' || valtype === 'string' )
                    return '--' + prop + ' ' + val;
                else
                    return '--' + prop;
            }
            _divider = ' ';
        }

        OptionsLoop: for( let o = 0, a = optionsArray.length; o < a; o++ ) {

            if( optionsArray[o].name === 'me' ) {
                let stax = ( _generator.outorder.value === 'staxrip' && _generator.outformat.value !== 'tab' );
                optionsArray[o].value = meConversion( optionsArray[o].value, !stax );
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, stax ? 'string' : 'number' );
                continue OptionsLoop;
            }
            else if( window.h265_properties.format.str_num.indexOf( optionsArray[o].name ) !== -1 ){
                let strNumType = isNaN( optionsArray[o].value ) ? 'string' : 'number'
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, strNumType );
                continue OptionsLoop;
            }
            else if( window.h265_properties.format.no_able.indexOf( optionsArray[o].name ) !== -1 ){
                if( optionsArray[o].name === 'recursion-skip' )
                    optionsArray[o].name = 'rskip';
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, 'boolean' );
                continue OptionsLoop;
            }
            else if( window.h265_properties.format.strange.indexOf( optionsArray[o].name ) !== -1 ){
                let specialCase = specialCasesFormats( optionsArray[o].name, optionsArray[o].value );
                optionsArray[o].sign = ( specialCase.v === null ) ? '' : signage( optionsArray[o].name, specialCase.v, specialCase.t );
                continue OptionsLoop;
            } else {
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, 'number' );
            }

        }

        return {
            signs   : optionsArray,
            divider : _divider
        };
    }

    /**
     * Primary out/inputs
     */
    _generator.in_code   = new Textarea( 'incoder-input' );
    _generator.out_code  = new Textarea( 'outcoder-output' );

    _generator.baseset   = new RadioGroup( 'baseset', ['none', 'default', 'custom'] );
    _generator.removeset = new RadioGroup( 'removeset', ['none', 'default', 'custom'] );
    _generator.outformat = new RadioGroup( 'outformat', ['cli', 'handbrake', 'json', 'tab', 'mediainfo'] );
    _generator.outorder  = new RadioGroup( 'outorder', ['none', 'staxrip', 'mediainfo'] );

    _generator.machine = function(){
        let optionsObj = {};

        if ( _generator.in_code.value.length ) {
            // Input is MediaInfo
            if ( _generator.in_code.value.indexOf('/') !== -1 ) {
                optionsObj = input2object( _generator.in_code.value, '/', '=' );
            }

            // Input is CLI
            else if ( _generator.in_code.value.indexOf('--') !== -1 ) {
                optionsObj = input2object( _generator.in_code.value, '--', ' ' );
            }

            // Input is Tabular (posibly from Excel)
            else if ( _generator.in_code.value.indexOf("\t") !== -1 && _generator.in_code.value.indexOf("\n") !== -1 ) {
                let tempV = _generator.in_code.value;
                tempV = tempV.toLowerCase();
                optionsObj = input2object( tempV, "\n", "\t" );
            }
            // Input is Handbrake
            else if ( _generator.in_code.value.indexOf(':') !== -1 && _generator.in_code.value.indexOf('=') !== -1 ) {
                optionsObj = input2object( _generator.in_code.value, ':', '=' );
            }
        }

        optionsObj = formatIncomingValues( optionsObj );
        optionsObj = addRemoveOptions( optionsObj );

        let optionsArr = [];

		// Convert options object into name-value pairs within an array
        for( let item in optionsObj )
    		optionsArr.push( { name: item, value: optionsObj[ item ] } );

        let out_obj   = outputFormatter( sorter( optionsArr ) ),
        	out_print = '',
        	divider   = out_obj.divider,
        	options   = out_obj.signs,
        	count     = out_obj.length;

        for( let o = 0, p = options.length; o < p; o++ ){
            if(typeof options[o].sign === 'undefined')
                console.log(options[o]);

            // do not add empty signs
            if(options[o].sign.trim() === '')
                continue;
            out_print += options[o].sign + divider;
        }
        // remove trailing divider
        out_print = out_print.substr(0, out_print.length - divider.length);

        _generator.out_code.value = out_print;
    };

    $( _generator.in_code.el ).on( 'keyup', function( event ){
        // Do not fire if key code is SHIFT (16), CTRL (17), CMD (91), INSERT (45)
        // LEFT (37), UP (38), RIGHT (39), DOWN (40)
        if ( event.keyCode === 16 || event.keyCode === 17 || event.keyCode === 91 || event.keyCode === 45
          || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40 )
            return false;

        _generator.machine();
    });

    $(function() {
       _generator.machine();
    });

})(jQuery);
