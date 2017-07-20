paramLimits = {
	N: {
		matched: { init: [ 1000, 2000 ], max: [ 1500, 3000 ]},
		normal: { init: [ 200, 750 ], max: [ 400, 1200 ]}
	},
	R: {
		matched: { init: [ 2500, 3500 ], max: [ 3500, 4200 ]},
		normal: { init: [ 1000, 1600 ], max: [ 1700, 2500 ]}
	},
	SR: {
		matched: { init: [ 3000, 4000 ], max: [ 4000, 5000 ]},
		normal: { init: [ 1400, 3200 ], max: [ 2500, 4400 ]}
	},
	UR: {
		matched: { init: [ 3000, 4000 ], max: [ 4200, 5400 ]},
		normal: { init: [ 2000, 3200 ], max: [ 3000, 4800 ]}
	}
};


// init -----------------------------------------------------------------------------------------------------------------------------------

$(function () {
	$(document).keypress(function (event) {
		if (event.which == '13')
			event.preventDefault();
	});
	
	onCharacterChange();
	onPropertyChange();

	onParameterChange();

	onBackgroundChange();
	onIdolizedBackgroundChange();

	onPortraitChange();
	onIdolizedPortraitChange();

	onIconTransformChange();
	onIdolizedIconTransformChange();
});

// helper functions -----------------------------------------------------------------------------------------------------------------------------------

var deleteHelp = function ($group) {
	$group.find('.form-control-feedback').remove();
	$group.removeClass('has-danger has-warning has-success');
};

var appendHelp = function (level, $group, message) {
	console.log(level, $group, message);

	$group.append(`<span class="form-control-feedback">${message}</span>`);
	$group.addClass(level);
};

// card event handlers -----------------------------------------------------------------------------------------------------------------------------------

$character = $('#character');
$character_group = $('#character_group');

$svg_title = $('.svg_title');

var onCharacterChange = function () {
	var id = $character.val();

	deleteHelp($character_group);

	if (!validator.isMongoId(id)) {
		$svg_title.text('');

		return appendHelp('has-danger', $character_group, 'Invalide Character ID');
	}

	$.getJSON('/api/characters', {
		id: id
	}, function (doc) {
		if (!doc._id)
			return appendHelp('has-danger', $character_group, 'Nonexistent Character ID');

		appendHelp('has-success', $character_group, doc.name_zh);
		$svg_title.text(doc.name_en.toUpperCase());
	});
};


$rarity = $('#rarity');
$attribute = $('#attribute');

$svg_overlay = $('.svg_overlay');
$svg_icon_overlay = $('.svg_icon_overlay');

var onPropertyChange = function () {
	$svg_overlay.attr('xlink:href', `/img/card/card-overlay-${$rarity.val().toLowerCase()}-${$attribute.val().toLowerCase()}.png`);
	$svg_icon_overlay.attr('xlink:href', `/img/card/icon-overlay-${$rarity.val().toLowerCase()}-${$attribute.val().toLowerCase()}.png`);

	onParameterChange();
};


$haru_init_group = $('#haru_init_group');
$haru_init = $('#haru_init');
$haru_max_group = $('#haru_max_group');
$haru_max = $('#haru_max');

$rei_init_group = $('#rei_init_group');
$rei_init = $('#rei_init');
$rei_max_group = $('#rei_max_group');
$rei_max = $('#rei_max');

$ma_init_group = $('#ma_init_group');
$ma_init = $('#ma_init');
$ma_max_group = $('#ma_max_group');
$ma_max = $('#ma_max');

$sp_init_group = $('#sp_init_group');
$sp_init = $('#sp_init');
$sp_max_group = $('#sp_max_group');
$sp_max = $('#sp_max');

var generateParameters = function () {
	var rarity = $rarity.val();
	var attribute = $attribute.val();

	var gaussianRandom = function (start, end) {
		var gaussianRand = function () {
			var rand = 0;
			for (var i = 0; i < 2; i++) rand += Math.random();
			return rand / 2;
		};

		return Math.round(start + gaussianRand() * (end - start));
	};

	var generateParam = function ($init, $max, limits, match) {
		var limit = match ? limits.matched : limits.normal;

		$init.val(gaussianRandom(limit.init[0], limit.init[1]));
		$max.val(gaussianRandom(limit.max[0], limit.max[1]));
	};

	generateParam($haru_init, $haru_max, paramLimits[rarity], attribute == 'Haru');
	generateParam($rei_init, $rei_max, paramLimits[rarity], attribute == 'Rei');
	generateParam($ma_init, $ma_max, paramLimits[rarity], attribute == 'Ma');

	$sp_init.val(gaussianRandom(1, 4));
	$sp_max.val(gaussianRandom(1, 4));

	onParameterChange();
};

var onParameterChange = function () {
	var rarity = $rarity.val();
	var attribute = $attribute.val();

	var checkParam = function ($init_group, $max_group, limits, match, init, max) {
		var limit = match ? limits.matched : limits.normal;
		
		deleteHelp($init_group);
		if (init < limit.init[0] || limit.init[1] < init)
			appendHelp('has-danger', $init_group, `Init not in range [${limit.init[0]}, ${limit.init[1]}]`);

		deleteHelp($max_group);
		if (max < limit.max[0] || limit.max[1] < max)
			appendHelp('has-danger', $max_group, `Max not in range [${limit.max[0]}, ${limit.max[1]}]`);
	};

	checkParam($haru_init_group, $haru_max_group, paramLimits[rarity], attribute == 'Haru', $haru_init.val(), $haru_max.val());
	checkParam($rei_init_group, $rei_max_group, paramLimits[rarity], attribute == 'Rei', $rei_init.val(), $rei_max.val());
	checkParam($ma_init_group, $ma_max_group, paramLimits[rarity], attribute == 'Ma', $ma_init.val(), $ma_max.val());
	
	deleteHelp($sp_init_group);
	var init = $sp_init.val();
	if (init < 1 || 4 < init)
		appendHelp('has-danger', $sp_init_group, `Init not in range [1, 4]`);

	deleteHelp($sp_max_group);
	var max = $sp_max.val();
	if (max < 1 || 4 < max)
		appendHelp('has-danger', $sp_max_group, `Max not in range [1, 4]`);
};


// image event handlers -----------------------------------------------------------------------------------------------------------------------------------

var changeImage = function ($image, $image_group, $svg_image, isOptional) {
	var id = $image.val();

	deleteHelp($image_group);

	if (id == '') {
		$svg_image.attr({ 
			'xlink:href': '',
			width: 0,
			height: 0
		});

		if (isOptional)
			return appendHelp('has-warning', $image_group, 'No image assigned');
	}

	if (!validator.isMongoId(id))
		return appendHelp('has-danger', $image_group, 'Invalide Image ID');

	$.getJSON('/api/images', {
		id: id
	}, function (doc) {
		if (!doc._id)
			return appendHelp('has-danger', $image_group, 'Nonexistent Image ID');

		appendHelp('has-success', $image_group, doc.name_original);

		$svg_image.attr({ 
			'xlink:href': '/upload/images/' + doc.name_local,
			width: doc.width * (720.0 / doc.height),
			height: 720
		});
	});
};


$portrait_group = $('#portrait_group');
$portrait = $('#portrait');

$svg_portrait = $('.svg_portrait');

var onPortraitChange = function () {
	changeImage($portrait, $portrait_group, $svg_portrait);

	onPortraitTransformChange();
};


$portrait_idolized_group = $('#portrait_idolized_group');
$portrait_idolized = $('#portrait_idolized');

$svg_portrait_idolized = $('.svg_portrait_idolized');

var onIdolizedPortraitChange = function () {
	changeImage($portrait_idolized, $portrait_idolized_group, $svg_portrait_idolized);

	onIdolizedPortraitTransformChange()
};


$background_group = $('#background_group');
$background = $('#background');

$svg_background = $('.svg_background');

var onBackgroundChange = function () {
	changeImage($background, $background_group, $svg_background, true);

	onBackgroundTransformChange();
};


$background_idolized_group = $('#background_idolized_group');
$background_idolized = $('#background_idolized');

$svg_background_idolized = $('.svg_background_idolized');

var onIdolizedBackgroundChange = function () {
	changeImage($background_idolized, $background_idolized_group, $svg_background_idolized, true);

	onIdolizedBackgroundTransformChange();
};


// image params event handlers -----------------------------------------------------------------------------------------------------------------------------------

var applyTransform = function ($image, x, y, rotation, scale) {
	console.log($image, `translate(${x?x:0} ${y?y:0}) rotate(${rotation?rotation:0}) scale(${scale?scale:1})`);

	$image.attr('transform', `translate(${x?x:0} ${y?y:0}) rotate(${rotation?rotation:0}) scale(${scale?scale:1})`);
};


$portrait_x = $('#portrait_x');
$portrait_y = $('#portrait_y');
$portrait_rotation = $('#portrait_rotation');
$portrait_scale = $('#portrait_scale');

var onPortraitTransformChange = function () {
	applyTransform(
		$svg_portrait, 
		$portrait_x.val(), $portrait_y.val(), $portrait_rotation.val(), $portrait_scale.val());
};


$portrait_idolized_x = $('#portrait_idolized_x');
$portrait_idolized_y = $('#portrait_idolized_y');
$portrait_idolized_rotation = $('#portrait_idolized_rotation');
$portrait_idolized_scale = $('#portrait_idolized_scale');

var onIdolizedPortraitTransformChange = function () {
	applyTransform(
		$svg_portrait_idolized, 
		$portrait_idolized_x.val(), $portrait_idolized_y.val(), $portrait_idolized_rotation.val(), $portrait_idolized_scale.val());
};


$background_x = $('#background_x');
$background_y = $('#background_y');
$background_rotation = $('#background_rotation');
$background_scale = $('#background_scale');

var onBackgroundTransformChange = function () {
	applyTransform(
		$svg_background, 
		$background_x.val(), $background_y.val(), $background_rotation.val(), $background_scale.val());
};


$background_idolized_x = $('#background_idolized_x');
$background_idolized_y = $('#background_idolized_y');
$background_idolized_rotation = $('#background_idolized_rotation');
$background_idolized_scale = $('#background_idolized_scale');

var onIdolizedBackgroundTransformChange = function () {
	applyTransform(
		$svg_background_idolized, 
		$background_idolized_x.val(), $background_idolized_y.val(), $background_idolized_rotation.val(), $background_idolized_scale.val());
};


$icon_x = $('#icon_x');
$icon_y = $('#icon_y');
$icon_rotation = $('#icon_rotation');
$icon_scale = $('#icon_scale');

$svg_icon = $('.svg_icon');

var onIconTransformChange = function () {
	applyTransform(
		$svg_icon, 
		$icon_x.val(), $icon_y.val(), $icon_rotation.val(), $icon_scale.val());
};


$icon_idolized_x = $('#icon_idolized_x');
$icon_idolized_y = $('#icon_idolized_y');
$icon_idolized_rotation = $('#icon_idolized_rotation');
$icon_idolized_scale = $('#icon_idolized_scale');

$svg_icon_idolized = $('.svg_icon_idolized');

var onIdolizedIconTransformChange = function () {
	applyTransform(
		$svg_icon_idolized, 
		$icon_idolized_x.val(), $icon_idolized_y.val(), $icon_idolized_rotation.val(), $icon_idolized_scale.val());
};