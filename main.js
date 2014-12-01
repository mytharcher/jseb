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
			Identifier: function (token, parent) {
				return token.name;
			},
			Accessor: function (token, parent) {
				return token.name;
			},
			MemberExpression: function (token, parent) {
				var property = jseb.build(token.property, token);
				return jseb.build(token.object, token) +
					(token.computed ? '[' + property + ']' : '.' + property);
			},
			Literal: function (token, parent) {
				return token.raw;
			},
			ThisExpression: function (token, parent) {
				return 'this';
			},
			CallExpression: function (token, parent) {
				return jseb.build(token.callee, token) + '(' +
					token.arguments.map(function (item) {
						return jseb.build(item, token);
					}).join() + ')';
			},
			UnaryExpression: function (token, parent) {
				return token.operator + jseb.build(token.argument, token);
			},
			BinaryExpression: function (token, parent) {
				var isLeftOperation = token.left.type == jseb.BINARY_EXP ||
					token.left.type == jseb.LogicalExpression;
				var isRightOperation = token.right.type == jseb.BINARY_EXP ||
					token.right.type == jseb.LogicalExpression;
				var left = jseb.build(token.left, token);
				if (isLeftOperation) {
					left = '(' + left + ')';
				}
				var right = jseb.build(token.right, token);
				if (isRightOperation) {
					right = '(' + right + ')';
				}
				return left + token.operator + right;
			},
			LogicalExpression: function (token, parent) {
				return jseb.builder.BinaryExpression(token);
			},
			ConditionalExpression: function (token, parent) {
				return '(' + jseb.build(token.test, token) + '?' +
					jseb.build(token.consequent, token) + ':' +
					jseb.build(token.alternate, token) + ')';
			},
			Array: function (token, parent) {
				return '[' + token.body.map(function (item) {
					return jseb.build(item, token);
				}).join() + ']';
			}
		},

		build: function (token, parent, options) {
			options = options || {};
			var type = token.type;
			var builder = jseb.builder[type];
			var preprocessor = jseb.preprocessor[type];
			var postprocessor = jseb.postprocessor[type];
			var result = preprocessor && preprocessor(token, parent, options) || token;
			result = builder(result);
			return postprocessor && postprocessor(result, parent, options) || result;
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
