var express = require('express');
var router = express.Router();

router.get('/temp', function (req, res, next) {
	var characters = [{"name_en":"Reimu Hakurei","name_ja":"博麗 霊夢","name_ja_romaji":"Hakurei Reimu","name_zh":"博丽灵梦"},
{"name_en":"Marisa Kirisame","name_ja":"霧雨 魔理沙","name_ja_romaji":"Kirisame Marisa","name_zh":"雾雨魔理沙"},
{"name_en":"SinGyoku","name_ja":"しんぎょく","name_zh":"神玉"},
{"name_en":"YuugenMagan","name_ja":"幽玄魔眼","name_ja_romaji":"Yūgenmagan","name_zh":"幽幻魔眼","alias_ja":["幽幻魔眼"]},
{"name_en":"Elis","name_ja":"エリス","name_ja_romaji":"Erisu","name_zh":"依莉斯"},
{"name_en":"Sariel","name_ja":"サリエル","name_ja_romaji":"Sarieru","name_zh":"萨丽爱尔"},
{"name_en":"Mima","name_ja":"魅魔","name_zh":"魅魔"},
{"name_en":"Kikuri","name_ja":"キクリ","name_zh":"菊理","alias_ja":["きくり"]},
{"name_en":"Konngara","name_ja":"矜羯羅","name_ja_romaji":"Kongara","name_zh":"矜羯罗","alias_ja":["こんがら"]},
{"name_en":"Genjii","name_ja":"玄爺","name_zh":"玄爷"},
{"name_en":"Rika","name_ja":"里香","name_zh":"里香"},
{"name_en":"Meira","name_ja":"明羅","name_zh":"明罗"},
{"name_en":"Marisa","name_ja":"魔梨沙","name_zh":"魔梨沙"},
{"name_en":"Ellen","name_ja":"エレン","name_ja_romaji":"Eren","name_zh":"爱莲"},
{"name_en":"Kotohime","name_ja":"小兎姫","name_zh":"小兔姬"},
{"name_en":"Kana Anaberal","name_ja":"カナ・アナベラル","name_ja_romaji":"Kana Anaberaru","name_zh":"卡娜・安娜贝拉尔"},
{"name_en":"Rikako Asakura","name_ja":"朝倉 理香子","name_ja_romaji":"Asakura Rikako","name_zh":"朝仓理香子"},
{"name_en":"Chiyuri Kitashirakawa","name_ja":"北白河 ちゆり","name_ja_romaji":"Kitashirakawa Chiyuri","alias_en":["Tiyuri Kitashirakawa"],"name_zh":"北白河千百合"},
{"name_en":"Yumemi Okazaki","name_ja":"岡崎 夢美","name_ja_romaji":"Okazaki Yumemi","name_zh":"冈崎梦美"},
{"name_en":"Ruukoto","name_ja":"るーこと","name_ja_romaji":"Rūkoto","name_zh":"留琴","alias_ja":["る～こと"]},
{"name_en":"Orange","name_ja":"オレンジ","name_ja_romaji":"Orenji","name_zh":"奥莲姬"},
{"name_en":"Kurumi","name_ja":"くるみ","name_zh":"胡桃"},
{"name_en":"Elly","name_ja":"エリー","name_ja_romaji":"Erī","alias_en":["Elliy"],"name_zh":"艾丽"},
{"name_en":"Yuuka","name_ja":"幽香","name_ja_romaji":"Yūka","alias_en":["Yuka"],"name_zh":"幽香"},
{"name_en":"Mugetsu","name_ja":"夢月","name_ja_romaji":"Mugetsu","alias_en":["Mugetu"],"name_zh":"梦月"},
{"name_en":"Gengetsu","name_ja":"幻月","name_ja_romaji":"Gengetsu","alias_en":["Gengetu"],"name_zh":"幻月"},
{"name_en":"Sara","name_ja":"サラ","name_zh":"萨拉"},
{"name_en":"Louise","name_ja":"ルイズ","name_ja_romaji":"Ruizu","alias_en":["Luize"],"name_zh":"露易兹"},
{"name_en":"Alice","name_ja":"アリス","name_ja_romaji":"Arisu","name_zh":"爱丽丝"},
{"name_en":"Yuki","name_ja":"ユキ","name_zh":"雪"},
{"name_en":"Mai","name_ja":"マイ","name_zh":"舞"},
{"name_en":"Yumeko","name_ja":"夢子","name_zh":"梦子"},
{"name_en":"Shinki","name_ja":"神綺","name_zh":"神绮"},
{"name_en":"Rumia","name_ja":"ルーミア","name_ja_romaji":"Rūmia","alias_en":["Lumia"],"name_zh":"露米娅"},
{"name_en":"Daiyousei","name_ja":"大妖精","name_ja_romaji":"Daiyōsei","name_zh":"大妖精"},
{"name_en":"Cirno","name_ja":"チルノ","name_ja_romaji":"Chiruno","name_zh":"琪露诺"},
{"name_en":"Hong Meirin","name_ja":"紅 美鈴","name_ja_romaji":"Hon Meirin","alias_en":["Hoan Meiling","Hong Meiling"],"name_zh":"红美铃"},
{"name_en":"Koakuma","name_ja":"小悪魔","name_zh":"小恶魔"},
{"name_en":"Patchouli Knowledge","name_ja":"パチュリー・ノーレッジ","name_ja_romaji":"Pachurī Nōrejji","name_zh":"帕秋莉・诺蕾姬"},
{"name_en":"Sakuya Izayoi","name_ja":"十六夜 咲夜","name_ja_romaji":"Izayoi Sakuya","name_zh":"十六夜咲夜"},
{"name_en":"Remilia Scarlet","name_ja":"レミリア・スカーレット","name_ja_romaji":"Remiria Sukāretto","name_zh":"蕾米莉亚・斯卡蕾特"},
{"name_en":"Flandre Scarlet","name_ja":"フランドール・スカーレット","name_ja_romaji":"Furandōru Sukāretto","alias_en":["Frandre Scarlet","Frandle Scarlet"],"name_zh":"芙兰朵露・斯卡蕾特"},
{"name_en":"Letty Whiterock","name_ja":"レティ・ホワイトロック","name_ja_romaji":"Reti Howaitorokku","name_zh":"蕾蒂・霍瓦特洛克"},
{"name_en":"Chen","name_ja":"橙","name_zh":"橙"},
{"name_en":"Alice Margatroid","name_ja":"アリス・マーガトロイド","name_ja_romaji":"Arisu Māgatoroido","name_zh":"爱丽丝・玛格特洛依德"},
{"name_en":"Lily White","name_ja":"リリーホワイト","name_ja_romaji":"Rirī Howaito","alias_en":["Lilywhite"],"name_zh":"莉莉霍瓦特","alias_zh":["莉莉白"]},
{"name_en":"Lunasa Prismriver","name_ja":"ルナサ・プリズムリバー","name_ja_romaji":"Runasa Purizumuribā","name_zh":"露娜萨・普莉兹姆利巴"},
{"name_en":"Merlin Prismriver","name_ja":"メルラン・プリズムリバー","name_ja_romaji":"Meruran Purizumuribā","alias_en":["Marlin Prismriver"],"name_zh":"梅露兰・普莉兹姆利巴"},
{"name_en":"Lyrica Prismriver","name_ja":"リリカ・プリズムリバー","name_ja_romaji":"Ririka Purizumuribā","name_zh":"莉莉卡・普莉兹姆利巴"},
{"name_en":"Youmu Konpaku","name_ja":"魂魄 妖夢","name_ja_romaji":"Konpaku Yōmu","alias_en":["Youmu Kompaku"],"name_zh":"魂魄妖梦"},
{"name_en":"Yuyuko Saigyouji","name_ja":"西行寺 幽々子","name_ja_romaji":"Saigyōji Yuyuko","alias_en":["Yuyuko Saigyouzi"],"name_zh":"西行寺幽幽子"},
{"name_en":"Ran Yakumo","name_ja":"八雲 藍","name_ja_romaji":"Yakumo Ran","name_zh":"八云蓝"},
{"name_en":"Yukari Yakumo","name_ja":"八雲 紫","name_ja_romaji":"Yakumo Yukari","name_zh":"八云紫"},
{"name_en":"Suika Ibuki","name_ja":"伊吹 萃香","name_ja_romaji":"Ibuki Suika","name_zh":"伊吹萃香"},
{"name_en":"Wriggle Nightbug","name_ja":"リグル・ナイトバグ","name_ja_romaji":"Riguru Naitobagu","name_zh":"莉格露・奈特巴格"},
{"name_en":"Mystia Lorelei","name_ja":"ミスティア・ローレライ","name_ja_romaji":"Misutia Rōrerai","name_zh":"米斯蒂娅・萝蕾拉"},
{"name_en":"Keine Kamishirasawa","name_ja":"上白沢 慧音","name_ja_romaji":"Kamishirasawa Keine","name_zh":"上白泽慧音"},
{"name_en":"Tewi Inaba","name_ja":"因幡 てゐ","name_ja_romaji":"Inaba Tewi","alias_en":["Tei Inaba"],"name_zh":"因幡帝"},
{"name_en":"Reisen Udongein Inaba","name_ja":"鈴仙・優曇華院・イナバ","name_zh":"铃仙・优昙华院・因幡"},
{"name_en":"Eirin Yagokoro","name_ja":"八意 永琳","name_ja_romaji":"Yagokoro Eirin","name_zh":"八意永琳"},
{"name_en":"Kaguya Houraisan","name_ja":"蓬莱山 輝夜","name_ja_romaji":"Hōraisan Kaguya","name_zh":"蓬莱山辉夜"},
{"name_en":"Huziwara no Mokou","name_ja":"藤原 妹紅","name_ja_romaji":"Fujiwara no Mokō","alias_en":["Fujiwara no Mokou"],"name_zh":"藤原妹红"},
{"name_en":"Aya Syameimaru","name_ja":"射命丸 文","name_ja_romaji":"Shameimaru Aya","alias_en":["Aya Shameimaru"],"name_zh":"射命丸文"},
{"name_en":"Medicine Melancholy","name_ja":"メディスン・メランコリー","name_ja_romaji":"Medisun Merankorī","alias_en":["Medicin Melancory"],"name_zh":"梅蒂欣・梅兰可莉"},
{"name_en":"Yuka Kazami","name_ja":"風見 幽香","name_ja_romaji":"Kazami Yūka","alias_en":["Yuuka Kazami"],"name_zh":"风见幽香"},
{"name_en":"Komachi Onozuka","name_ja":"小野塚 小町","name_ja_romaji":"Onozuka Komachi","alias_en":["Komachi Onoduka"],"name_zh":"小野塚小町"},
{"name_en":"Sikieiki Yamaxanadu","name_ja":"四季映姫・ヤマザナドゥ","name_ja_romaji":"Shikieiki Yamazanadu","alias_en":["Shikieiki Yamaxanadu"],"name_zh":"四季映姬・亚玛萨那度"},
{"name_en":"Shizuha Aki","name_ja":"秋 静葉","name_ja_romaji":"Aki Shizuha","alias_en":["Sizuha Aki"],"name_zh":"秋静叶"},
{"name_en":"Minoriko Aki","name_ja":"秋 穣子","name_ja_romaji":"Aki Minoriko","name_zh":"秋穰子"},
{"name_en":"Hina Kagiyama","name_ja":"鍵山 雛","name_ja_romaji":"Kagiyama Hina","name_zh":"键山雏"},
{"name_en":"Nitori Kawashiro","name_ja":"河城 にとり","name_ja_romaji":"Kawashiro Nitori","alias_en":["Nitori Kawasiro"],"name_zh":"河城荷取"},
{"name_en":"Momizi Inubashiri","name_ja":"犬走 椛","name_ja_romaji":"Inubashiri Momiji","alias_en":["Momiji Inubashiri"],"name_zh":"犬走椛"},
{"name_en":"Sanae Kotiya","name_ja":"東風谷 早苗","name_ja_romaji":"Kochiya Sanae","alias_en":["Sanae Kochiya"],"name_zh":"东风谷早苗"},
{"name_en":"Kanako Yasaka","name_ja":"八坂 神奈子","name_ja_romaji":"Yasaka Kanako","name_zh":"八坂神奈子"},
{"name_en":"Suwako Moriya","name_ja":"洩矢 諏訪子","name_ja_romaji":"Moriya Suwako","name_zh":"洩矢诹访子"},
{"name_en":"Iku Nagae","name_ja":"永江 衣玖","name_ja_romaji":"Nagae Iku","name_zh":"永江衣玖"},
{"name_en":"Tenshi Hinanai","name_ja":"比那名居 天子","name_ja_romaji":"Hinanai Tenshi","alias_en":["Tensi Hinanawi"],"name_zh":"比那名居天子"},
{"name_en":"Kisume","name_ja":"キスメ","name_zh":"琪斯美"},
{"name_en":"Yamame Kurodani","name_ja":"黒谷 ヤマメ","name_ja_romaji":"Kurodani Yamame","name_zh":"黑谷山女"},
{"name_en":"Parsee Mizuhashi","name_ja":"水橋 パルスィ","name_ja_romaji":"Mizuhashi Parusi","alias_en":["Parsee Mizuhasi"],"name_zh":"水桥帕露西"},
{"name_en":"Yugi Hoshiguma","name_ja":"星熊 勇儀","name_ja_romaji":"Hoshiguma Yūgi","alias_en":["Yuugi Hoshiguma"],"name_zh":"星熊勇仪"},
{"name_en":"Satori Komeiji","name_ja":"古明地 さとり","name_ja_romaji":"Komeiji Satori","name_zh":"古明地觉"},
{"name_en":"Rin Kaenbyou","name_ja":"火焔猫 燐","name_ja_romaji":"Kaenbyō Rin","name_zh":"火焰猫燐"},
{"name_en":"Utsuho Reiuzi","name_ja":"霊烏路 空","name_ja_romaji":"Reiuji Utsuho","alias_en":["Utuho Reiuji"],"name_zh":"灵乌路空"},
{"name_en":"Koishi Komeiji","name_ja":"古明地 こいし","name_ja_romaji":"Komeiji Koishi","name_zh":"古明地恋"},
{"name_en":"Nazrin","name_ja":"ナズーリン","name_ja_romaji":"Nazūrin","alias_en":["Nazlin"],"name_zh":"娜兹玲"},
{"name_en":"Kogasa Tatara","name_ja":"多々良 小傘","name_ja_romaji":"Tatara Kogasa","name_zh":"多多良小伞"},
{"name_en":"Ichirin Kumoi","name_ja":"雲居 一輪","name_ja_romaji":"Kumoi Ichirin","name_zh":"云居一轮"},
{"name_en":"Unzan","name_ja":"雲山","name_zh":"云山"},
{"name_en":"Minamitsu Murasa","name_ja":"村紗 水蜜","name_ja_romaji":"Murasa Minamitsu","alias_en":["Minamitu Murasa"],"name_zh":"村纱水蜜"},
{"name_en":"Syou Toramaru","name_ja":"寅丸 星","name_ja_romaji":"Toramaru Shō","alias_en":["Shou Toramaru"],"name_zh":"寅丸星"},
{"name_en":"Byakuren Hiziri","name_ja":"聖 白蓮","name_ja_romaji":"Hijiri Byakuren","alias_en":["Byakuren Hijiri"],"name_zh":"圣白莲"},
{"name_en":"Nue Houjuu","name_ja":"封獣 ぬえ","name_ja_romaji":"Hōjū Nue","name_zh":"封兽鵺"},
{"name_en":"Master Big Catfish","name_ja":"大ナマズ様","name_ja_romaji":"Ō Namazu-sama","name_zh":"大鲶鱼","alias_ja":["大ナマズ"]},
{"name_en":"Hatate Himekaidou","name_ja":"姫海棠 はたて","name_ja_romaji":"Himekaidō Hatate","name_zh":"姬海棠果","alias_zh":["姬海棠羽立","姬海棠极"]},
{"name_en":"Sunny Milk","name_ja":"サニーミルク","name_ja_romaji":"Sanīmiruku","alias_en":["Sunnymilk"],"name_zh":"桑尼米尔克"},
{"name_en":"Luna Child","name_ja":"ルナチャイルド","name_ja_romaji":"Runachairudo","alias_en":["Lunarchild"],"name_zh":"露娜切露德"},
{"name_en":"Star Sapphire","name_ja":"スターサファイア","name_ja_romaji":"Sutāsafaia","alias_en":["Starsaphire"],"name_zh":"斯塔萨菲雅"},
{"name_en":"Kyouko Kasodani","name_ja":"幽谷 響子","name_ja_romaji":"Kasodani Kyōko","name_zh":"幽谷响子"},
{"name_en":"Yoshika Miyako","name_ja":"宮古 芳香","name_ja_romaji":"Miyako Yoshika","name_zh":"宫古芳香"},
{"name_en":"Seiga Kaku","name_ja":"霍 青娥","name_ja_romaji":"Kaku Seiga","name_zh":"霍青娥","alias_zh":["青娥娘娘"],"alias_ja":["青娥 娘々"]},
{"name_en":"Soga no Toziko","name_ja":"蘇我 屠自古","name_ja_romaji":"Soga no Tojiko","alias_en":["Soga no Tojiko"],"name_zh":"苏我屠自古"},
{"name_en":"Mononobe no Futo","name_ja":"物部 布都","name_ja_romaji":"Mononobe no Futo","name_zh":"物部布都"},
{"name_en":"Toyosatomimi no Miko","name_ja":"豊聡耳 神子","name_ja_romaji":"Toyosatomimi no Miko","name_zh":"丰聪耳神子"},
{"name_en":"Mamizou Hutatsuiwa","name_ja":"二ッ岩 マミゾウ","name_ja_romaji":"Futatsuiwa Mamizō","alias_en":["Mamizou Hutatuiwa","Mamizou Futatsuiwa"],"name_zh":"二岩猯藏"},
{"name_en":"Hata no Kokoro","name_ja":"秦 こころ","name_zh":"秦心"},
{"name_en":"Wakasagihime","name_ja":"わかさぎ姫","name_zh":"若鹭姬"},
{"name_en":"Sekibanki","name_ja":"赤蛮奇","name_zh":"赤蛮奇"},
{"name_en":"Kagerou Imaizumi","name_ja":"今泉 影狼","name_ja_romaji":"Imaizumi Kagerou","name_zh":"今泉影狼"},
{"name_en":"Benben Tsukumo","name_ja":"九十九 弁々","name_ja_romaji":"Tsukumo Benben","name_zh":"九十九弁弁"},
{"name_en":"Yatsuhashi Tsukumo","name_ja":"九十九 八橋","name_ja_romaji":"Tsukumo Yatsuhashi","name_zh":"九十九八桥"},
{"name_en":"Seija Kijin","name_ja":"鬼人 正邪","name_ja_romaji":"Kijin Seija","name_zh":"鬼人正邪"},
{"name_en":"Shinmyoumaru Sukuna","name_ja":"少名 針妙丸","name_ja_romaji":"Sukuna Shinmyoumaru","name_zh":"少名针妙丸"},
{"name_en":"Raiko Horikawa","name_ja":"堀川 雷鼓","name_ja_romaji":"Horikawa Raiko","name_zh":"堀川雷鼓"},
{"name_en":"Kasen Ibaraki","name_ja":"茨木 華扇","name_ja_romaji":"Ibaraki Kasen","name_zh":"茨木华扇","alias_zh":["茨华仙"],"alias_ja":["茨華仙"]},
{"name_en":"Sumireko Usami","name_ja":"宇佐見 菫子","name_ja_romaji":"Usami Sumireko","name_zh":"宇佐见堇子"},
{"name_en":"Seiran","name_ja":"清蘭","name_zh":"清兰"},
{"name_en":"Ringo","name_ja":"鈴瑚","name_zh":"铃瑚"},
{"name_en":"Doremy Sweet","name_ja":"ドレミー・スイート","name_ja_romaji":"Doremī Suīto","name_zh":"哆来咪・苏伊特"},
{"name_en":"Sagume Kishin","name_ja":"稀神 サグメ","name_ja_romaji":"Kishin Sagume","alias_en":["Sagume Kisin"],"name_zh":"稀神探女"},
{"name_en":"Clownpiece","name_ja":"クラウンピース","name_ja_romaji":"Kuraunpīsu","name_zh":"克劳恩皮丝"},
{"name_en":"Junko","name_ja":"純狐","name_zh":"纯狐"},
{"name_en":"Hecatia Lapislazuli","name_ja":"ヘカーティア・ラピスラズリ","name_ja_romaji":"Hekatiā Rapisurazuri","name_zh":"赫卡提亚・拉碧斯拉祖利"},
{"name_en":"Etanity Larva","name_ja":"エタニティラルバ","name_ja_romaji":"Etaniti Raruba","alias_en":["Etarnity Larva","Eternity Larva"],"name_zh":"爱塔妮缇拉尔瓦"},
{"name_en":"Nemuno Sakata","name_ja":"坂田 ネムノ","name_ja_romaji":"Sakata Nemuno","name_zh":"坂田合欢乃"},
{"name_en":"Aunn Komano","name_ja":"高麗野 あうん","name_ja_romaji":"Komano Aun","name_zh":"高丽野阿吽"},
{"name_en":"Renko Usami","name_ja":"宇佐見 蓮子","name_ja_romaji":"Usami Renko","name_zh":"宇佐见莲子"},
{"name_en":"Maribel Hearn","name_ja":"マエリベリー・ハーン","name_ja_romaji":"Maeriberī Hān","alias_en":["Maribel Han"],"name_zh":"玛艾露贝莉・赫恩","alias_zh":["梅莉"],"alias_ja":["メリー"]},
{"name_en":"Rinnosuke Morichika","name_ja":"森近 霖之助","name_ja_romaji":"Morichika Rinnosuke","name_zh":"森近霖之助"},
{"name_en":"Hieda no Akyuu","name_ja":"稗田 阿求","name_ja_romaji":"Hieda no Akyū","alias_en":["Hieda no Akyu"],"name_zh":"稗田阿求"},
{"name_en":"Watatsuki no Toyohime","name_ja":"綿月 豊姫","name_zh":"绵月丰姬"},
{"name_en":"Watatsuki no Yorihime","name_ja":"綿月 依姫","name_zh":"绵月依姬"},
{"name_en":"Reisen","name_ja":"レイセン","name_zh":"铃仙二号"},
{"name_en":"Kosuzu Motoori","name_ja":"本居 小鈴","name_ja_romaji":"Motoori Kosuzu","name_zh":"本居小铃"}];

	var Character = require('../models/character');

	Character.deleteMany({} , function (err) {
		if (err) return next(err);
		Character.create(characters, function (err, docs) {
			if (err) return next(err);
			res.send(docs);
		});
	});
});

var genericApi = require('../controllers/api/genericApi');
router.get('/users', genericApi(require('../models/user')));
router.get('/artists', genericApi(require('../models/artist')));
router.get('/images', genericApi(require('../models/image')));
router.get('/characters', genericApi(require('../models/character')));
router.get('/cards', genericApi(require('../models/card')));

var artistApi = require('../controllers/api/artistApi');
router.get('/artists/list', artistApi.list);

var imageApi = require('../controllers/api/imageApi');
router.get('/images/keywords', imageApi.keywords);
router.get('/images/siblings', imageApi.siblings);
router.post('/images/upload', imageApi.upload);

module.exports = router;
