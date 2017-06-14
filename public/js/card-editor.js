var s = {
	character_group: $('#character_group'),
	character: $('#character'),
	rarity: $('#rarity'),
	attribute: $('#attribute'),

	sp_init_group: $('#sp_init_group'),
	sp_init: $('#sp_init'),
	sp_max_group: $('#sp_max_group'),
	sp_max: $('#sp_max'),
	
	haru_init_group: $('#haru_init_group'),
	haru_init: $('#haru_init'),
	haru_max_group: $('#haru_max_group'),
	haru_max: $('#haru_max'),
	
	rei_init_group: $('#rei_init_group'),
	rei_init: $('#rei_init'),
	rei_max_group: $('#rei_max_group'),
	rei_max: $('#rei_max'),
	
	ma_init_group: $('#ma_init_group'),
	ma_init: $('#ma_init'),
	ma_max_group: $('#ma_max_group'),
	ma_max: $('#ma_max'),
	
	portrait_group: $('#portrait_group'),
	portrait: $('#portrait'),
	portrait_x: $('#portrait_x'),
	portrait_y: $('#portrait_y'),
	portrait_rotation: $('#portrait_rotation'),
	portrait_scale: $('#portrait_scale'),
	
	background_group: $('#background_group'),
	background: $('#background'),
	background_x: $('#background_x'),
	background_y: $('#background_y'),
	background_rotation: $('#background_rotation'),
	background_scale: $('#background_scale'),
	
	portrait_idolized_group: $('#portrait_idolized_group'),
	portrait_idolized: $('#portrait_idolized'),
	portrait_idolized_x: $('#portrait_idolized_x'),
	portrait_idolized_y: $('#portrait_idolized_y'),
	portrait_idolized_rotation: $('#portrait_idolized_rotation'),
	portrait_idolized_scale: $('#portrait_idolized_scale'),
	
	background_idolized_group: $('#background_idolized_group'),
	background_idolized: $('#background_idolized'),
	background_idolized_x: $('#background_idolized_x'),
	background_idolized_y: $('#background_idolized_y'),
	background_idolized_rotation: $('#background_idolized_rotation'),
	background_idolized_scale: $('#background_idolized_scale'),
	
	icon_x: $('#icon_x'),
	icon_y: $('#icon_y'),
	icon_rotation: $('#icon_rotation'),
	icon_scale: $('#icon_scale'),
	
	icon_idolized_x: $('#icon_idolized_x'),
	icon_idolized_y: $('#icon_idolized_y'),
	icon_idolized_rotation: $('#icon_idolized_rotation'),
	icon_idolized_scale: $('#icon_idolized_scale'),
	
	ic_pos: $('#ic_pos'),
	ic_rot: $('#ic_rot'),
	ic_scl: $('#ic_scl'),
	ic_id_pos: $('#ic_id_pos'),
	ic_id_rot: $('#ic_id_rot'),
	ic_id_scl: $('#ic_id_scl'),

	ch_h: $('.ch_h'),

	co_img: $('.co_img'),
	io_img: $('.io_img'),

	bg_pos: $('.bg_pos'),
	bg_rot: $('.bg_rot'),
	bg_img: $('.bg_img'),
	bg_id_pos: $('.bg_id_pos'),
	bg_id_rot: $('.bg_id_rot'),
	bg_id_img: $('.bg_id_img'),

	pt_pos: $('.pt_pos'),
	pt_rot: $('.pt_rot'),
	pt_img: $('.pt_img'),
	pt_id_pos: $('.pt_id_pos'),
	pt_id_rot: $('.pt_id_rot'),
	pt_id_img: $('.pt_id_img'),
	
	limits: {
		N: {
			param_match: { init: [ 1000, 2000 ], max: [ 1500, 3000 ]},
			param_normal: { init: [ 200, 750 ], max: [ 400, 1200 ]}
		},
		R: {
			param_match: { init: [ 2500, 3500 ], max: [ 3500, 4200 ]},
			param_normal: { init: [ 1000, 1600 ], max: [ 1700, 2500 ]}
		},
		SR: {
			param_match: { init: [ 3000, 4000 ], max: [ 4000, 5000 ]},
			param_normal: { init: [ 1400, 3200 ], max: [ 2500, 4400 ]}
		},
		UR: {
			param_match: { init: [ 3000, 4000 ], max: [ 4200, 5400 ]},
			param_normal: { init: [ 2000, 3200 ], max: [ 3000, 4800 ]}
		}
	}
};

// init -----------------------------------------------------------------------------------------------------------------------------------

$(function () {
	$(document).keypress(function (event) {
		if (event.which == '13')
			event.preventDefault();
	});
	
	onCharacterChange();
	onCharacterParamChange();

	onParameterChange();

	onBackgroundChange();
	onIdolizedBackgroundChange();

	onPortraitChange();
	onIdolizedPortraitChange();

	onIconParamChange();
	onIdolizedIconParamChange();
});

// helper functions -----------------------------------------------------------------------------------------------------------------------------------

var gaussianRandom = function (start, end) {
	var gaussianRand = function () {
		var rand = 0;
		for (var i = 0; i < 2; i++)
			rand += Math.random();
		return rand / 2;
	};

	return Math.round(start + gaussianRand() * (end - start));
};

var deleteHelp = function (g) {
	g.find('.help-block').remove();
	g.removeClass('has-error has-success');
};

var appendHelp = function (g, msg) {
	console.log(msg);
	g.append(`<span class="help-block">${msg}</span>`);
};

var appendErrorHelp = function (g, msg) {
	appendHelp(g, msg);
	g.addClass('has-error');
};

var appendSuccessHelp = function (g, msg) {
	appendHelp(g, msg);
	g.addClass('has-success');
};

var checkParam = function (group_init, group_max, limits, match, init, max) {
	var limit = match ? limits.param_match : limits.param_normal;
	
	deleteHelp(group_init);
	deleteHelp(group_max);

	if (init < limit.init[0] || limit.init[1] < init)
		appendErrorHelp(group_init, `Init not in range [${limit.init[0]}, ${limit.init[1]}]`);
	if (max < limit.max[0] || limit.max[1] < max)
		appendErrorHelp(group_max, `Max not in range [${limit.max[0]}, ${limit.max[1]}]`);
};

var generateParam = function (init, max, limits, match) {
	var limit = match ? limits.param_match : limits.param_normal;

	init.val(gaussianRandom(limit.init[0], limit.init[1]));
	max.val(gaussianRandom(limit.max[0], limit.max[1]));
};

var applyTransform = function (pos, rot, img, x, y, r, s) {
	console.log(`translate(${x?x:0}%, ${y?y:0}%)`, `rotate(${r?r:0}deg)`, `${s?s:0}%`);

	pos.css('transform', `translate(${x?x:0}%, ${y?y:0}%)`);
	rot.css('transform', `rotate(${r?r:0}deg)`);
	img.css('height', `${s?s:100}%`);
};

var applyIconTransform = function (pos, rot, scl, x, y, r, s) {
	console.log(`translate(${x?x:0}%, ${y?y:0}%)`, `rotate(${r?r:0}deg)`, `scale(${s?(s/100.0):0})`);

	pos.css('transform', `translate(${x?x:0}%, ${y?y:0}%)`);
	rot.css('transform', `rotate(${r?r:0}deg)`);
	scl.css('transform', `scale(${s?(s/100.0):0})`);
};

// event handlers -----------------------------------------------------------------------------------------------------------------------------------

var onCharacterChange = function () {
	var id = s.character.val();

	deleteHelp(s.character_group);

	if (!validator.isMongoId(id))
		return appendErrorHelp(s.character_group, 'Invalide Character ID');

	$.getJSON('/api/characters/' + id, function (data) {
		if (!data._id)
			return appendErrorHelp(s.character_group, 'Nonexistent Character ID');

		appendSuccessHelp(s.character_group, data.name_jp);
		s.ch_h.text(data.name_en.toUpperCase());
	});
};

var onParameterChange = function () {
	var rarity = s.rarity.val();
	var attribute = s.attribute.val();

	checkParam(s.haru_init_group, s.haru_max_group, s.limits[rarity], attribute == 'Haru', s.haru_init.val(), s.haru_max.val());
	checkParam(s.rei_init_group, s.rei_max_group, s.limits[rarity], attribute == 'Rei', s.rei_init.val(), s.rei_max.val());
	checkParam(s.ma_init_group, s.ma_max_group, s.limits[rarity], attribute == 'Ma', s.ma_init.val(), s.ma_max.val());
	
	deleteHelp(s.sp_init_group);
	deleteHelp(s.sp_max_group);

	var sp_init = s.sp_init.val();
	var sp_max = s.sp_max.val();
	if (sp_init < 1 || 4 < sp_init)
		appendErrorHelp(sp_init_group, `Init not in range [1, 4]`);
	if (sp_max < 1 || 4 < sp_max)
		appendErrorHelp(sp_max_group, `Max not in range [1, 4]`);
};

var onCharacterParamChange = function () {
	s.co_img.attr('src', `/img/card-overlay-${s.rarity.val().toLowerCase()}-${s.attribute.val().toLowerCase()}.png`);
	s.io_img.attr('src', `/img/icon-overlay-${s.rarity.val().toLowerCase()}-${s.attribute.val().toLowerCase()}.png`);

	onParameterChange();
};

var generateParameters = function () {
	var rarity = s.rarity.val();
	var attribute = s.attribute.val();

	generateParam(s.haru_init, s.haru_max, s.limits[rarity], attribute == 'Haru');
	generateParam(s.rei_init, s.rei_max, s.limits[rarity], attribute == 'Rei');
	generateParam(s.ma_init, s.ma_max, s.limits[rarity], attribute == 'Ma');

	s.sp_init.val(gaussianRandom(1, 4));
	s.sp_max.val(gaussianRandom(1, 4));

	onParameterChange();
};

// card event handlers -----------------------------------------------------------------------------------------------------------------------------------

var onBackgroundChange = function () {
	var id = s.background.val();

	deleteHelp(s.background_group);

	if (id == '') {
		appendHelp(s.background_group, 'No image assigned');
		s.bg_img.attr('src', '');
		return;
	}

	if (!validator.isMongoId(id))
		return appendErrorHelp(s.background_group, 'Invalide Image ID');

	$.getJSON('/api/images/' + id, function (data) {
		if (!data._id)
			return appendErrorHelp(s.background_group, 'Nonexistent Image ID');

		appendSuccessHelp(s.background_group, data.title);
		s.bg_img.attr('src', data.url_src);
	});

	onBackgroundParamChange();
};

var onIdolizedBackgroundChange = function () {
	var id = s.background_idolized.val();

	deleteHelp(s.background_idolized_group);

	if (id == '') {
		appendHelp(s.background_idolized_group, 'No image assigned');
		s.bg_id_img.attr('src', '');
		return;
	}

	if (!validator.isMongoId(id))
		return appendErrorHelp(s.background_idolized_group, 'Invalide Image ID');

	$.getJSON('/api/images/' + id, function (data) {
		if (!data._id)
			return appendErrorHelp(s.background_idolized_group, 'Nonexistent Image ID');

		appendSuccessHelp(s.background_idolized_group, data.title);
		s.bg_id_img.attr('src', data.url_src);
	});

	onIdolizedBackgroundParamChange();
};

var onBackgroundParamChange = function () {
	applyTransform(
		s.bg_pos, s.bg_rot, s.bg_img, 
		s.background_x.val(), s.background_y.val(), s.background_rotation.val(), s.background_scale.val());
};

var onIdolizedBackgroundParamChange = function () {
	applyTransform(
		s.bg_id_pos, s.bg_id_rot, s.bg_id_img, 
		s.background_idolized_x.val(), s.background_idolized_y.val(), s.background_idolized_rotation.val(), s.background_idolized_scale.val());
};

var onPortraitChange = function () {
	var id = s.portrait.val();

	deleteHelp(s.portrait_group);

	if (!validator.isMongoId(id))
		return appendErrorHelp(s.portrait_group, 'Invalide Image ID');

	$.getJSON('/api/images/' + id, function (data) {
		if (!data._id)
			return appendErrorHelp(s.portrait_group, 'Nonexistent Image ID');

		appendSuccessHelp(s.portrait_group, data.title);
		s.pt_img.attr('src', data.url_src);
	});

	onPortraitParamChange();
};

var onIdolizedPortraitChange = function () {
	var id = s.portrait_idolized.val();

	deleteHelp(s.portrait_idolized_group);

	if (!validator.isMongoId(id))
		return appendErrorHelp(s.portrait_idolized_group, 'Invalide Image ID');

	$.getJSON('/api/images/' + id, function (data) {
		if (!data._id)
			return appendErrorHelp(s.portrait_idolized_group, 'Nonexistent Image ID');

		appendSuccessHelp(s.portrait_idolized_group, data.title);
		s.pt_id_img.attr('src', data.url_src);
	});

	onIdolizedPortraitParamChange()
};

var onPortraitParamChange = function () {
	applyTransform(
		s.pt_pos, s.pt_rot, s.pt_img, 
		s.portrait_x.val(), s.portrait_y.val(), s.portrait_rotation.val(), s.portrait_scale.val());
};

var onIdolizedPortraitParamChange = function () {
	applyTransform(
		s.pt_id_pos, s.pt_id_rot, s.pt_id_img, 
		s.portrait_idolized_x.val(), s.portrait_idolized_y.val(), s.portrait_idolized_rotation.val(), s.portrait_idolized_scale.val());
};

var onIconParamChange = function () {
	applyIconTransform(
		s.ic_pos, s.ic_rot, s.ic_scl, 
		s.icon_x.val(), s.icon_y.val(), s.icon_rotation.val(), s.icon_scale.val());
};

var onIdolizedIconParamChange = function () {
	applyIconTransform(
		s.ic_id_pos, s.ic_id_rot, s.ic_id_scl, 
		s.icon_idolized_x.val(), s.icon_idolized_y.val(), s.icon_idolized_rotation.val(), s.icon_idolized_scale.val());
};