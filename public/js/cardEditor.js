var character_group;

var sp_init_group, haru_init_group, rei_init_group, ma_init_group;

var sp_max_group, haru_max_group, rei_max_group, ma_max_group;

var background_group, background_idolized_group, 
	portrait_group, portrait_idolized_group;

var paramLimits;

$(document).ready(function () {
	start();
	
	onCharacterChange();
	onParameterChange();
	
	onCharacterParamChange();

	onBackgroundChange();
	onIdolizedBackgroundChange();

	onPortraitChange();
	onIdolizedPortraitChange();
});

function start() {
	$(document).keypress(function (event) {
		if (event.which == '13')
			event.preventDefault();
	});

	character_group = $('#character_group');

	sp_init_group = $('#sp_init_group');
	haru_init_group = $('#haru_init_group');
	rei_init_group = $('#rei_init_group');
	ma_init_group = $('#ma_init_group');

	sp_max_group = $('#sp_max_group');
	haru_max_group = $('#haru_max_group');
	rei_max_group = $('#rei_max_group');
	ma_max_group = $('#ma_max_group');

	background_group = $('#background_group');
	background_idolized_group = $('#background_idolized_group');

	portrait_group = $('#portrait_group');
	portrait_idolized_group = $('#portrait_idolized_group');

	paramLimits = {
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
	};
}

function deleteHelp(group) {
	group.find('.help-block').remove();
	group.removeClass('has-error has-success');
}

function appendHelp(group, msg) {
	console.log(msg);
	
	group.append(`<span class="help-block">${msg}</span>`);
}

function appendErrorHelp(group, msg) {
	appendHelp(group, msg);
	group.addClass('has-error');
}

function appendSuccessHelp(group, msg) {
	appendHelp(group, msg);
	group.addClass('has-success');
}


function onCharacterChange() {
	var value = $('#character').val();

	deleteHelp(character_group);

	if (!validator.isMongoId(value))
		return appendErrorHelp(character_group, 'Invalide Character ID');

	$.ajax({
		url: '/api/characters/' + value,
		dataType: 'json'
	}).done(function (data, status) {
		console.log(data, status);

		if (!data._id)
			return appendErrorHelp(character_group, 'Nonexistent Character ID');

		appendSuccessHelp(character_group, data.name_jp);
		$('.ch_h').text(data.name_en.toUpperCase());
	});
}

function onParameterChange() {
	var haru_init = $('#haru_init').val();
	var rei_init = $('#rei_init').val();
	var ma_init = $('#ma_init').val();

	var haru_max = $('#haru_max').val();
	var rei_max = $('#rei_max').val();
	var ma_max = $('#ma_max').val();

	var rarity = $('#rarity').val();
	var attribute = $('#attribute').val();

	var checkParam = function (group_init, group_max, limits, match, init, max) {
		var limit = match ? limits.param_match : limits.param_normal;
		
		deleteHelp(group_init);
		deleteHelp(group_max);

		if (init < limit.init[0] || limit.init[1] < init)
			appendErrorHelp(group_init, `Init not in range [ ${limit.init[0]}, ${limit.init[1]} ]`);
		if (max < limit.max[0] || limit.max[1] < max)
			appendErrorHelp(group_max, `Max not in range [ ${limit.max[0]}, ${limit.max[1]} ]`);
	};

	checkParam(haru_init_group, haru_max_group, paramLimits[rarity], attribute == 'Haru', haru_init, haru_max);
	checkParam(rei_init_group, rei_max_group, paramLimits[rarity], attribute == 'Rei', rei_init, rei_max);
	checkParam(ma_init_group, ma_max_group, paramLimits[rarity], attribute == 'Ma', ma_init, ma_max);
	
	var sp_init = $('#sp_init').val();
	var sp_max = $('#sp_max').val();

	deleteHelp(sp_init_group);
	deleteHelp(sp_max_group);

	if (sp_init < 1 || 4 < sp_init)
		appendErrorHelp(sp_init_group, `Init not in range [ 1, 4 ]`);
	if (sp_max < 1 || 4 < sp_max)
		appendErrorHelp(sp_max_group, `Max not in range [ 1, 4 ]`);
}

function onCharacterParamChange() {
	$('.co_img').attr('src', `/img/card-overlay-${$('#rarity').val().toLowerCase()}-${$('#attribute').val().toLowerCase()}.png`);
	$('.io_img').attr('src', `/img/icon-overlay-${$('#rarity').val().toLowerCase()}-${$('#attribute').val().toLowerCase()}.png`);

	onParameterChange();
}

function gaussianRandom(start, end) {
	gaussianRand = function () {
		var rand = 0;
		for (var i = 0; i < 4; i += 1)
			rand += Math.random();
		return rand / 4;
	};

	return Math.round(start + gaussianRand() * (end - start));
}

function generateParameters() {
	console.log('generateParameters');

	var sp_init = $('#sp_init');
	var haru_init = $('#haru_init');
	var rei_init = $('#rei_init');
	var ma_init = $('#ma_init');

	var sp_max = $('#sp_max');
	var haru_max = $('#haru_max');
	var rei_max = $('#rei_max');
	var ma_max = $('#ma_max');

	var rarity = $('#rarity').val();
	var attribute = $('#attribute').val();

	var generateParam = function (init, max, limits, match) {
		var limit = match ? limits.param_match : limits.param_normal;

		init.val(gaussianRandom(limit.init[0], limit.init[1]));
		max.val(gaussianRandom(limit.max[0], limit.max[1]));
	};

	generateParam(haru_init, haru_max, paramLimits[rarity], attribute == 'Haru');
	generateParam(rei_init, rei_max, paramLimits[rarity], attribute == 'Rei');
	generateParam(ma_init, ma_max, paramLimits[rarity], attribute == 'Ma');

	sp_init.val(gaussianRandom(1, 4));
	sp_max.val(gaussianRandom(1, 4));

	onParameterChange();
}

// Cards ///////////////////////////////////////////////////////////////////////////////////////////

function onBackgroundChange() {
	var value = $('#background').val();

	deleteHelp(background_group);

	if (value == '') {
		appendHelp(background_group, 'No image assigned');
		$('.bg_img').attr('src', '');
		return;
	}

	if (!validator.isMongoId(value))
		return appendErrorHelp(background_group, 'Invalide Image ID');

	$.ajax({
		url: '/api/images/' + value,
		dataType: 'json'
	}).done(function (data, status) {
		console.log(data, status);

		if (!data._id)
			return appendErrorHelp(background_group, 'Nonexistent Image ID');

		appendSuccessHelp(background_group, data.name_original);
		$('.bg_img').attr('src', '/res/img/' + data.name_local);
	});
}

function onIdolizedBackgroundChange() {
	var value = $('#background_idolized').val();

	deleteHelp(background_idolized_group);

	if (value == '') {
		appendHelp(background_idolized_group, 'No image assigned');
		$('.bg_id_img').attr('src', '');
		return;
	}

	if (!validator.isMongoId(value))
		return appendErrorHelp(background_idolized_group, 'Invalide Image ID');

	$.ajax({
		url: '/api/images/' + value,
		dataType: 'json'
	}).done(function (data, status) {
		console.log(data, status);

		if (!data._id)
			return appendErrorHelp(background_idolized_group, 'Nonexistent Image ID');

		appendSuccessHelp(background_idolized_group, data.name_original);
		$('.bg_id_img').attr('src', '/res/img/' + data.name_local);
	});
}

function applyTransform(pos, rot, img, x, y, r, s) {
	console.log(`translate(${x?x:0}%, ${y?y:0}%)`, `rotate(${r?r:0}deg)`, `${s?s:0}%`);

	pos.css('transform', `translate(${x?x:0}%, ${y?y:0}%)`);
	rot.css('transform', `rotate(${r?r:0}deg)`);
	img.css('height', `${s?s:100}%`);
}

function onBackgroundParamInput () {
	console.log('onBackgroundParamInput');

	applyTransform(
		$('.bg_pos'), $('.bg_rot'), $('.bg_img'), 
		$('#background_x').val(), $('#background_y').val(), $('#background_rotation').val(), $('#background_scale').val());
}

var pt_img = '', id_img = '';

function onPortraitChange() {
	var value = $('#portrait').val();

	deleteHelp(portrait_group);

	if (!validator.isMongoId(value))
		return appendErrorHelp(portrait_group, 'Invalide Image ID');

	$.ajax({
		url: '/api/images/' + value,
		dataType: 'json'
	}).done(function (data, status) {
		console.log(data, status);

		if (!data._id)
			return appendErrorHelp(portrait_group, 'Nonexistent Image ID');

		appendSuccessHelp(portrait_group, data.name_original);
		$('.pt_img').attr('src', '/res/img/' + data.name_local);
		pt_img = '/res/img/' + data.name_local;
	});

	onPortraitParamChange();
}

function onIdolizedPortraitChange() {
	var value = $('#portrait_idolized').val();

	deleteHelp(portrait_idolized_group);

	if (!validator.isMongoId(value))
		return appendErrorHelp(portrait_idolized_group, 'Invalide Image ID');

	$.ajax({
		url: '/api/images/' + value,
		dataType: 'json'
	}).done(function (data, status) {
		console.log(data, status);

		if (!data._id)
			return appendErrorHelp(portrait_idolized_group, 'Nonexistent Image ID');

		appendSuccessHelp(portrait_idolized_group, data.name_original);
		$('.pt_id_img').attr('src', '/res/img/' + data.name_local);
		id_img = '/res/img/' + data.name_local;
	});

	onIdolizedPortraitParamChange()
}

function onPortraitParamChange() {
	applyTransform(
		$('.pt_pos'), $('.pt_rot'), $('.pt_img'), 
		$('#portrait_x').val(), $('#portrait_y').val(), $('#portrait_rotation').val(), $('#portrait_scale').val());

	$('.pt_img').attr('src', pt_img);
}

function onIdolizedPortraitParamChange() {
	applyTransform(
		$('.pt_id_pos'), $('.pt_id_rot'), $('.pt_id_img'), 
		$('#portrait_idolized_x').val(), $('#portrait_idolized_y').val(), $('#portrait_idolized_rotation').val(), $('#portrait_idolized_scale').val());

	$('.pt_id_img').attr('src', id_img);
}

function onIconParamChange() {
	var x = $('#icon_x').val(), 
		y = $('#icon_y').val(), 
		r = $('#icon_rotation').val(), 
		s = $('#icon_scale').val()

	console.log(`translate(${x?x:0}%, ${y?y:0}%)`, `rotate(${r?r:0}deg)`, `scale(${s?(s/100.0):0})`);

	$('#ic_pos').css('transform', `translate(${x?x:0}%, ${y?y:0}%)`);
	$('#ic_rot').css('transform', `rotate(${r?r:0}deg)`);
	$('#ic_scl').css('transform', `scale(${s?(s/100.0):0})`);
}

function onIdolizedIconParamChange() {
	var x = $('#icon_idolized_x').val(), 
		y = $('#icon_idolized_y').val(), 
		r = $('#icon_idolized_rotation').val(), 
		s = $('#icon_idolized_scale').val()

	console.log(`translate(${x?x:0}%, ${y?y:0}%)`, `rotate(${r?r:0}deg)`, `scale(${s?(s/100.0):0})`);

	$('#ic_id_pos').css('transform', `translate(${x?x:0}%, ${y?y:0}%)`);
	$('#ic_id_rot').css('transform', `rotate(${r?r:0}deg)`);
	$('#ic_id_scl').css('transform', `scale(${s?(s/100.0):0})`);
}