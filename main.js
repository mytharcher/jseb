(function (root) {

	var jseb = {
		// COMPOUND: 'Compound',
		IDENTIFIER: 'Identifier',
		ACCESSOR: 'Accessor',
		MEMBER_EXP: 'MemberExpression',
		LITERAL: 'Literal',
		THIS_EXP: 'ThisExpression',
		CALL_EXP: 'CallExpression',
		UNARY_EXP: 'UnaryExpression',
		BINARY_EXP: 'BinaryExpression',
		LOGICAL_EXP: 'LogicalExpression',
		CONDITIONAL_EXP: 'ConditionalExpression',
		ARRAY_EXP: 'Array',

		preprocessor: {},
		postprocessor: {},

		builder: {
			Identifier: function (token) {
				return token.name;
			},
			Accessor: function (token) {
				return token.name;
			},
			MemberExpression: function (token) {
				var property = jseb.build(token.property);
				return jseb.build(token.object) +
					(token.computed ? '[' + property + ']' : '.' + property);
			},
			Literal: function (token) {
				return token.raw;
			},
			ThisExpression: function (token) {
				return 'this';
			},
			CallExpression: function (token) {
				return jseb.build(token.callee) + '(' +
					token.arguments.map(jseb.build).join() + ')';
			},
			UnaryExpression: function (token) {
				return token.operator + jseb.build(token.argument);
			},
			BinaryExpression: function (token) {
				var isLeftOperation = token.left.type == jseb.BINARY_EXP ||
					token.left.type == jseb.LogicalExpression;
				var isRightOperation = token.right.type == jseb.BINARY_EXP ||
					token.right.type == jseb.LogicalExpression;
				var left = jseb.build(token.left);
				if (isLeftOperation) {
					left = '(' + left + ')';
				}
				var right = jseb.build(token.right);
				if (isRightOperation) {
					right = '(' + right + ')';
				}
				return left + token.operator + right;
			},
			LogicalExpression: function (token) {
				return jseb.builder.BinaryExpression(token);
			},
			ConditionalExpression: function (token) {
				return '(' + jseb.build(token.test) + '?' +
					jseb.build(token.consequent) + ':' +
					jseb.build(token.alternate) + ')';
			},
			Array: function (token) {
				return '[' + token.body.map(jseb.build).join() + ']';
			}
		},

		build: function (token) {
			var type = token.type;
			var builder = jseb.builder[type];
			var preprocessor = jseb.preprocessor[type];
			var postprocessor = jseb.postprocessor[type];
			var result = preprocessor && preprocessor(token) || token;
			result = builder(result);
			return postprocessor && postprocessor(result) || result;
		},

		registerPreprocessor: function (type, fn) {
			jseb.preprocessor[type] = fn;
		},

		registerPostprocessor: function (type, fn) {
			jseb.postprocessor[type] = fn;
		}
	};

	for (var i in jseb) {
		jseb.build[i] = jseb[i];
	}

	if (typeof exports === 'undefined') {

		root.jseb = jseb.build;

		if (root.jsep) {
			root.jsep.build = jseb.build;
		}
	} else {
		module.exports = jseb.build;
	}
})(this);
