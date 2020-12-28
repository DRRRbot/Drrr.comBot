let json;

let lastTalk;

let DRRR_URL = 'https://drrr.com/room/?ajax=1&api=json';

let modersArray = [ 'Miles/0442' ];

let allArrays = [
[ greetArray = [], 'Ht6L2qH5' ],
[ byeArray = [], 'x7ukEAbP' ],
[ girlsArray = [], '4Bup2PCM', 'mVMEpRzY', 'AfMphpgP', 'ycXdFMEJ' ],
[ musicArray = [], 'LnTyhzbp' ],
[ catsArray = [], 'ytTMaAfb' ],
[ foodArray = [] , 'MW3iWb7W' ]
];

let clearArrays = function () {
	for ( arr of allArrays ) {
		arr[0].splice( 0, arr[0].length );
	}
};

let randomize = function( anyArray ) {
	return anyArray[ Math.floor( Math.random() * anyArray.length ) ];
};

let sendCMD = function( cmd , id ) {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: cmd + id
	});
};

let sendMSG = function( msg ) {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: {
			message: msg
		}
	});
};

let sendPrivateMSG = function( id, msg ) {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: {
			to: id,
			message: msg
		}
	});
};

let sendImage = function( msg , imgArray ) {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: {
			message: msg,
			url: randomize( imgArray )
		}
	});
};

let sendMusic = function() {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: {
			music: 'music',
			name: 'Случайная музыка',
			url: randomize(musicArray)
		}
	});
};

let roomName = function( msg ) {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: {
			room_name: msg
		}
	});
};

let roomDesc = function( msg ) {
	$.ajax({
		type: 'POST',
		url: DRRR_URL,
		data: {
			room_description: msg
		}
	});
};

let spinBottle = function() {
	if ( json.room.users.length > 2 ) {
		let u1, u2;
		do {
			u1 = json.room.users[ Math.floor( Math.random() * json.room.users.length ) ];
			u2 = json.room.users[ Math.floor( Math.random() * json.room.users.length ) ];
		} while ( u1.id == json.profile.id || u2.id == json.profile.id || u1.id == u2.id );
		sendMSG( u1.name + ' -> ' + u2.name );
	} else {
		sendMSG( 'Слишком мало людей.' );
	}
};

let rollDice = function() {
	sendMSG( json.room.talks[0].from.name + ': [' + ( Math.floor( Math.random() * 6 ) + 1 ) + ']' );
};

let whiteListMode = false;
let whiteList = [];
let cleanMode = false;

let moderCMD = function( cmd ) {
	if ( modersArray.includes( json.room.talks[0].from.tripcode ) ) {
		let talk = json.room.talks[0];
		switch( cmd ) {
			case 'ban=':
			case 'kick=':
				for ( user of json.room.users ) {
					if ( talk.message.includes( user.name ) && user.id != json.profile.id ) {
						if ( talk.from.tripcode == modersArray[0] ) {
							sendCMD( cmd , user.id );
						} else if ( !modersArray.includes( user.tripcode ) ) {
							sendCMD( cmd , user.id );
						}
					}
				}
				break;
			case 'new_host=':
				sendCMD( cmd , talk.from.id );
				break;
			case 'wl':
				if ( !whiteListMode ) {
					for ( user of json.room.users ) {
						whiteList.push( user.id );
					}
					whiteListMode = true;
					sendMSG('Режим WhiteList активирован');
				} else {
					whiteList.splice( 0, whiteList.length );
					whiteListMode = false;
					sendMSG('Режим WhiteList деактивирован');
				}
				break;
			case 'reload':
				clearArrays();
				botLoad();
				break;
			case 'clean':
				if ( !cleanMode ) {
					cleanMode = true;
					let i = 0,
					cleaning = setInterval( function() {
						sendPrivateMSG( json.profile.id, '.' );
						i++;
						if ( i >= 100 ) {
							i = 0;
							cleanMode = false;
							clearInterval( cleaning );
						}
					}, 2000, i );
				}
				break;
			case 'say':
				sendMSG(talk.message.replace('!say ',''));
				break;
			case 'rename':
				roomName(talk.message.replace('!rename ',''));
				break;
			case 'desc':
				roomDesc(talk.message.replace('!desc ',''));
				break;
		}
	}
};

let accessArray = [
['Miles/0442', 'господин Адмирал'],
['MethodFkII', 'Метод'],
['Poi/BUqwEA', 'Пои'],
['MOMOY0CUko', 'Момо'],
['6VhqGDisco', 'госпожа Фран'],
['HEIFEJe.xs', 'Хейфец'],
['hELLTBEAMQ', 'капитан Бим'],
['ERETIKAfOQ', 'Ретик'],
['pASTOR6EWM', 'Пастор'],
['Thor/m7wS.', 'Тор'],
['LINAPoo4ww', 'Лина'],
['LuvcuS/GO.', 'Цезий'],
['SBEV/1t8N2', 'Сбив'],
['Angelv7ONE', 'Ангел'],
['DanteBufXI', 'завсегдатай клуба'],
['C3KSEd.XsU', 'госпожа Дракарис'],
['/BIRd/iueY', 'Санжерин'],
['SlavenL1Yo', 'Славен'],
['WaNna/kyVo', 'Однако'],
['vorobAH...', 'капитан Воробей'],
['X/TAyano22', 'капитан Воробей'],
['AmeliaiBFA', 'капитан Воробей'],
['WaNna/kyVo', 'Однако'],
['P32XO664JU', 'A.D.'],
['ANKER5c3aA', 'господин Риван'],
['Yashi9sAF.', 'Яширо-сан'],
['Doki/krD32', 'гость']
];

let luck = function(){
	let luckUser = json.room.talks[0].from.id;
	let luckValue = Math.floor( Math.random() * 101 );
	if (luckValue<10) {
		sendCMD('ban=',luckUser);
	} else if (luckValue<20) {
		sendCMD('kick=',luckUser);
	} else if (luckValue<30) {
		sendImage('Еда:', foodArray );
	} else if (luckValue<40) {
		sendImage('Котик:', catsArray );
	} else if (luckValue<70) {
		sendMusic();
	} else if (luckValue<101) {
		sendImage('Тян:', girlsArray );
	}
};

//let afk_array = [];

let BOT_MAIN = function() {
	
	if ( whiteListMode ) {
		for ( user of json.room.users ) {
			if (!whiteList.includes(user.id) && !accessArray.some(arr => arr.includes(user.tripcode))) {
				sendCMD( 'ban=', user.id );
			}
		}
	}
	/*
	for (user of json.room.users) {
		if (!afk_array.some(arr => arr.includes(user.id))) {
			afk_array.push([][]);
		}
	}
	for (afk of afk_array) {
		if ( (Date.now() - afk[1]) > 10*(1000*60) ) {
			sendCMD( 'kick=', afk[0] );
		}
	}
*/
	if (json.room.talks[0].id!=lastTalk) {
		if (json.room.talks[0].type == 'message' && json.room.talks[0].from.id != json.profile.id) {
			let msg = json.room.talks[0].message;
			if (msg.includes('!ban')) {
				moderCMD('ban=');
			} else if (msg.includes('!kick')) {
				moderCMD('kick=');
			} else if (msg.includes('!host')) {
				moderCMD('new_host=');
			} else if (msg.includes('!wl')) {
				moderCMD('wl');
			} else if (msg.includes('!reload')) {
				moderCMD('reload');
			} else if (msg.includes('!clean')) {
				moderCMD('clean');
			} else if (msg.includes('!say')) {
				moderCMD('say');
			} else if (msg.includes('!rename')) {
				moderCMD('rename');
			} else if (msg.includes('!desc')) {
				moderCMD('desc');
			} else if (msg.includes('!music')) {
				sendMusic();
			} else if (msg.includes('!bottle')) {
				spinBottle();
			} else if (msg.includes('!dice')) {
				rollDice();
			} else if (msg.includes('!tyan')) {
				sendImage('Тян:', girlsArray );
			} else if (msg.includes('!cat')) {
				sendImage('Котик:', catsArray );
			} else if (msg.includes('!food')) {
				sendImage('Еда:', foodArray );
			} else if (msg.includes('!luck')) {
				luck();
			} else if (msg.includes('!git')) {
				$.ajax({
					type: 'POST',
					url: DRRR_URL,
					data: {
						message: 'Код бота на github: ',
						url: 'https://github.com/DRRRbot/Drrr.comBot/blob/master/drrrbot_v4.js'
					}
				});
			}
		} else if (json.room.talks[0].type == 'join' && json.room.talks[0].user.id != json.profile.id) {
			if (json.room.talks[0].user.tripcode){
				if (accessArray.some(arr => arr.includes(json.room.talks[0].user.tripcode))) {
					sendMSG( randomize(greetArray).replace('@name', accessArray.find(arr => arr.includes(json.room.talks[0].user.tripcode))[1]));
				}
			}
		} else if (json.room.talks[0].type == 'leave') {
			if (json.room.talks[0].user.tripcode){
				if (accessArray.some(arr => arr.includes(json.room.talks[0].user.tripcode))) {
					sendMSG( randomize(byeArray).replace('@name', accessArray.find(arr => arr.includes(json.room.talks[0].user.tripcode))[1]));
				}
			}
		}
		lastTalk = json.room.talks[0].id;
	}
};

let DRRR_REQUEST = function(){
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
			json = JSON.parse(xmlhttp.responseText);
			BOT_MAIN();
		}
	};
	xmlhttp.open('GET', DRRR_URL, true);
	xmlhttp.send();
};

let botOnline = false;

let BOT_START = function(){
	
	setInterval( function() {
		DRRR_REQUEST();
	}, 1000);
	botOnline = true;
	console.log( 'Бот запущен!' );
	
	setInterval( function() {
		sendPrivateMSG( json.profile.id, '.' );
		console.clear();
	}, 600000);
};

let loadArrays = function( i , j ) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if( xhr.readyState === 4 && xhr.status === 200 ) {
			for ( line of xhr.responseText.split( '\r\n' ) ) {
				allArrays[i][0].push( line );
			}
			console.log( 'Загрузка данных... ' + Math.round( (((j/(allArrays[i].length-1)+i)/allArrays.length))*100 ) + '%' );
			if ( allArrays[i][ j + 1 ] ) {
				setTimeout( loadArrays( i , j + 1 ), 5000 );
			} else if ( i < allArrays.length - 1 ) {
				j = 1;
				setTimeout( loadArrays( i + 1 , j ), 5000 );
			} else {
				console.log( 'Загрузка завершена!' );
				if ( !botOnline ) {
					BOT_START();
				} else {
					sendMSG( 'Массивы перезагружены.' );
				}
			}
		}
	};
	xhr.open( 'GET', 'https://api.allorigins.win/raw?url=https://pastebin.com/raw/' + allArrays[i][j], true );
	xhr.setRequestHeader('Content-type', 'text/plain');
	xhr.send();
};

let botLoad = function() {
	console.clear();
	console.log( 'Загрузка данных...' );
	loadArrays( 0, 1 );
};

botLoad();
