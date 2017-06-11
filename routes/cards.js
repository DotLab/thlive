var express = require('express');
var router = express.Router();

var cardController = require('../controllers/cardController');

var marked = require('marked');
router.get('/', function (req, res) {
	var code = `
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             \` class="\$\{cls\}"\`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}

export  $initHighlight;
	`;
	var str = 'I am using __markdown__.\n# Marked in browser\n\nRendered by **marked**.\n```js\n$("#hi").on("click");\nconsole.log("hello");\nvar a = function (c) { return this.b; };\n' + code + '```';


	res.send(`
		<html>
			<head>
				<link rel="stylesheet" href="/css/hljs/monokai-sublime.css">
			</head>
			<body>
				${marked(str)}
			</body>
		</html>
		`);
});

router.get('/add', cardController.add_form);
router.post('/add', cardController.add);

// router.get('/:id', cardController.detail);

module.exports = router;
