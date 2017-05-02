
(function($) {

    "use strict";

    window._generator = {};

    /*
     * Number Cleanser
     *
     * @param {mixed} n Number to clean-up
     * @returns {intger} Cleansed number
     */
    var cleanNumber = function(n){n=parseFloat((''+n).replace(/[^\d\.\-]/g,''));return isNaN(n)?0:n;};

    /*
     * Convert text to numbers
     *
     * @param {string} t String to convert
     * @returns {intger|string}
     */
    var numerify = function(t){return isNaN(t)?t:cleanNumber(t)};

    /*
     * Merge properties of one object with another object
     * 
     * @param {object}  defaultObject      Object with properties that will be the default values
     * @param {object}  mergerObject       Object with properties that will change the default when specified
     * @param {boolean} discardAdditional  Properties in mergerObject that are not in defaultObject will be disgarded
     *
     * @return {object}
     */
    var mergeObjects = function(defaultObject, mergerObject, discardAdditional = true ) {
        if( discardAdditional ) {
            //Return all properties of defaultObject only
            for(let property in defaultObject)
                if( typeof mergerObject[ property ] !== 'undefined' ) defaultObject[ property ] = mergerObject[ property ];
            return defaultObject;

        } else {
              //Return all properties of defaultObject as well as any others from mergerObject 
            for(let property in defaultObject)
                if( typeof mergerObject[ property ] === 'undefined' ) mergerObject[ property ] = defaultObject[ property ];
            return mergerObject;
        }
    }

    /**
     * Convert Media Info string to Object
     *
     * @param {string} text The string to convert
     *
     * @return {object}
     */
    var mediaInfo2object = function( text ){
        let sections = text.split('/'),
            sLen     = sections.length,
            options  = {};

        for ( let s = 0; s < sLen; s++ ) {
            sections[s] = sections[s].trim();
            if( sections[s].length === 0 )
                continue;

            if( sections[s].indexOf('=') !== -1 ) {
                let property = sections[s].split('=');
                options[ property[0] ] = numerify( property[1] );
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
    var cli2object = function( text ){
        let sections = text.split('--'),
            sLen     = sections.length,
            options  = {};

        for ( let s = 0; s < sLen; s++ ) {
            sections[s] = sections[s].trim();
            if( sections[s].length === 0 )
                continue;

            if( sections[s].indexOf(' ') !== -1 ) {
                let property = sections[s].split(' ');
                options[ property[0] ] = numerify( property[1] );
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
    var input2object = function( text, splitter, equal ){
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
                options[ property[0].substr(3) ] = numerify( property[1] ) !== 1;
            }
            else if( hasEqual ) {
                let property = sections[s].split( equal );
                options[ property[0] ] = numerify( property[1] );
            }
            else if ( sub3isNo ){
                options[ sections[s].substr(3) ] = false;
            }
            else {
                options[ sections[s] ] = true;
            }
            //let tempV = .replace(/(no-[a-z-]+)=1/, '$1');
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
    var meConversion = function( i, return_number = true ) {
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

    let rebaser = function( options ){
        if(_generator.baseset.value === 'default') {
            return mergeObjects( window.h265_arguments.base.default, options, true );
        }

        if(_generator.baseset.value === 'custom')
            return mergeObjects( window.h265_arguments.base.custom, options, true );

        //if(_generator.baseset.value === 'none')
        return options;
    }

    let sorter = function( options ) {
        let theOrder = [],
            sortedObject = [],
            canBeSorted = [],
            notBeSorted = [];

        if(_generator.outorder.value === 'mediainfo')
            theOrder = window.h265_arguments.order.mediainfo;
        else if(_generator.outorder.value === 'staxrip')
            theOrder = window.h265_arguments.order.staxrip;
        else { //if(_generator.outorder.value === 'none')
            for( let prop in options )
                sortedObject.push( { name: prop, value: options[ prop ] } );
            return sortedObject;
        }

        for( let o in options ){
            let i = theOrder.indexOf( o );
            if( i !== -1 )
                canBeSorted[ i ] = o;
            else
                notBeSorted.push( o );
        }

        for( let s = 0, l = canBeSorted.length; s < l; s++ ){
            if( typeof canBeSorted[s] === 'undefined' )
                continue;
            sortedObject.push( { name: canBeSorted[s], value: options[ canBeSorted[s] ] } );
        }

        for( let u = 0, l = notBeSorted.length; u < l; u++ ){
            sortedObject.push( { name: notBeSorted[u], value: options[ notBeSorted[u] ] } );
        }
        
        return sortedObject;
    }

    let formatter = function( optionsArray ) {
        let signage, _divider;

        
        if(_generator.outformat.value === 'handbrake') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' ) {
                    val = ( val === true || val === 1 || val === 'true')
                    return val ? prop : 'no-' + prop + '=1';
                }
                return prop + '=' + val;
            }
            _divider   = ':';
        }
        else if(_generator.outformat.value === 'json') {
            signage = function( prop, val, valtype ) {
                prop = '"' + prop + '"';

                if ( valtype === 'boolean' || valtype === 'number' )
                    return prop + ':' + val;

                return prop + ':' + '"' + val + '"';
            }
            _divider   = ',';
        }
        else if(_generator.outformat.value === 'tab') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' )
                    val = val ? 'TRUE' : 'FALSE';

                return prop + "\t" + val;
            }
            _divider   = "\n";
        }
        else if(_generator.outformat.value === 'mediainfo') {
            signage = function( prop, val, valtype ) {
                if ( valtype === 'boolean' )
                    return  val ? prop : 'no-' + prop;
                return prop + '=' + val;
            }
            _divider   = ' / ';
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
            _divider   = ' ';
        }

        let no_able = window.h265_properties.format.no_able,
            str_num = window.h265_properties.format.str_num,
            strange = window.h265_properties.format.strange;

        let specialCasesFormats = function( prop, val ){
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
                case 'pass' :
                    if( val === true )
                        return { v: 1, t: 'number' }
                    else if( val === 1 ||  val === 2 || val === 3)
                        return numberObject;
                    else
                        return nullObject;
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
        };
        let numericStringCasesFormats = function( prop, val ){
            return isNaN( val ) ? 'string' : 'number';
        };

        OptionsLoop: for( let o = 0, a = optionsArray.length; o < a; o++ ){
            let str_num_index = str_num.indexOf( optionsArray[o].name ),
                no_able_index = no_able.indexOf( optionsArray[o].name );

            if( optionsArray[o].name === 'me' ) {
                let stax = ( _generator.outorder.value === 'staxrip' && _generator.outformat.value !== 'tab' );
                optionsArray[o].value = meConversion( optionsArray[o].value, !stax );
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, stax ? 'string' : 'number' );
                continue OptionsLoop;
            }
            else if( str_num_index !== -1 ){
                let strNumType = isNaN( optionsArray[o].value ) ? 'string' : 'number'
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, strNumType );
                continue OptionsLoop;
            }
            else if( no_able_index !== -1 ){
                if( optionsArray[o].name === 'recursion-skip' )
                    optionsArray[o].name = 'rskip';
                optionsArray[o].sign = signage( optionsArray[o].name, optionsArray[o].value, 'boolean' );
                continue OptionsLoop;
            }
            else if( strange.indexOf( optionsArray[o].name ) !== -1 ){
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
    _generator.incoder   = new Textarea( 'incoder-input' );
    _generator.outcoder  = new Textarea( 'outcoder-output' );

    _generator.baseset   = new RadioGroup( 'baseset', ['none', 'default', 'custom'] );
    _generator.outformat = new RadioGroup( 'outformat', ['cli', 'handbrake', 'json', 'tab', 'mediainfo'] );
    _generator.outorder  = new RadioGroup( 'outorder', ['none', 'staxrip', 'mediainfo'] );

    _generator.machine = function(){
        let options = {},
            count,
            divider,
            output = '';

        if ( _generator.incoder.value.length ) {
            // Input is MediaInfo
            if ( _generator.incoder.value.indexOf('/') !== -1 ) {
                options = input2object( _generator.incoder.value, '/', '=' );
            }

            // Input is CLI
            else if ( _generator.incoder.value.indexOf('--') !== -1 ) {
                options = input2object( _generator.incoder.value, '--', ' ' );
            }

            // Input is Tabular (posibly from Excel)
            else if ( _generator.incoder.value.indexOf("\t") !== -1 && _generator.incoder.value.indexOf("\n") !== -1 ) {
                let tempV = _generator.incoder.value;
                tempV = tempV.toLowerCase();
                options = input2object( tempV, "\n", "\t" );
            }
            // Input is Handbrake
            else if ( _generator.incoder.value.indexOf(':') !== -1 && _generator.incoder.value.indexOf('=') !== -1 ) {
                options = input2object( _generator.incoder.value, ':', '=' );
            }
        }

        // first off fix formats of boolean values
        for( let prop in options ){
            let tempV = options[ prop ];
            tempV = tempV === 'true'  ? true  : tempV;
            tempV = tempV === 'false' ? false : tempV;
            options[ prop ] = tempV;
        }

        options  = rebaser( options );
        options  = sorter( options );
        options  = formatter( options );

        divider  = options.divider;
        options  = options.signs;
        count    = options.length;

        //console.log(options);

        
        for( let o = 0, p = options.length; o < p; o++ ){
            if(typeof options[o].sign === 'undefined')
                console.log(options[o]);

            // do not add empty signs
            if(options[o].sign.trim() === '')
                continue;
            output += options[o].sign + divider;
        }
        // remove trailing divider
        output = output.substr(0, output.length - divider.length);

        _generator.outcoder.value = output;
    };

    $( _generator.incoder.el ).on( 'keyup', function( event ){

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
