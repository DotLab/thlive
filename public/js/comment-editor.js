var s = {
	markdown: $('#markdown'),
	preview: $('#preview')
};

$(document).delegate('textarea', 'keydown', function(e) {
	var keyCode = e.keyCode || e.which;

	if (keyCode == 9) {
		e.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;

		// set textarea value to: text before caret + tab + text after caret
		$(this).val($(this).val().substring(0, start) + '  ' + $(this).val().substring(end));

		// put caret at right position again
		this.selectionStart = this.selectionEnd = start + 2;
	}
});

$(function () {
	marked.setOptions({
		highlight: code => hljs.highlightAuto(code).value,
		langPrefix:'hljs '
	});
});

var onContentChange = function () {
	s.preview.html(marked(s.markdown.val()));

	$('textarea').keyup(function(e) {
		while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
			$(this).height($(this).height() + 1);
		};
	});
};