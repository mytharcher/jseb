jseb
==========

JavaScript Expression Builder which build JS expression from [jsep](http://jsep.from.so/) parsed AST tokens.

The purpose of this package is for building parsed AST back to JS expression with additional injection. You can do some preprocess before build by register one handler each token type.

Usage
----------

### Browser ###

    <script src="/PATH/TO/jseb.js" type="text/javascript"></script>
    <script type="text/javascript">
    var exp = jseb(jsep('a+1')); // 'a+1'
    </script>

### Node.js ###

    var jsep = require('jsep');
    var jseb = require('jseb');
    jseb(jsep('a+1')); // 'a+1'

### Preprocessor ###

    var jseb = require('jseb');
    jseb.registerPreprocessor(jseb.MEMBER_EXP, function (token) {
        // anything you like to preprocess the token
        // ...
        return token;
    });

### Token Types ###

All the token types are from jsep except `ACCESSOR`.

* `jseb.IDENTIFIER`
* `jseb.ACCESSOR` (extended)
* `jseb.MEMBER_EXP`
* `jseb.LITERAL`
* `jseb.THIS_EXP`
* `jseb.CALL_EXP`
* `jseb.UNARY_EXP`
* `jseb.BINARY_EXP`
* `jseb.LOGICAL_EXP`
* `jseb.CONDITIONAL_EXP`
* `jseb.ARRAY_EXP`

## MIT Licensed ##

-EOF-
