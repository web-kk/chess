$(document).ready(function() {
	var canvas = $('#canvas').get(0);
	var ctx = canvas.getContext('2d');
	var sep = 40;
	var sr = 4;
	var br = 16;
	var qzwz = {};
	var audio = $('#audio').get(0);
	var kong={}
	var starttime='pause';
	var AI=false;
	////////////////quan/////////////
	function circle(x, y) {
		ctx.save()
		ctx.translate(l(x), l(y))
		ctx.beginPath()
		ctx.arc(0, 0, sr, 0, Math.PI * 2)
		ctx.closePath()
		ctx.fillStyle = 'saddlebrown'
		ctx.fill()
		ctx.restore()
	}

	function l(x) {
		return (x + 0.5) * sep + 0.5
	}
	////////////////棋盘//////////////
	function qiPan() {
		ctx.save()
		ctx.beginPath();
		for(var i = 0; i < 15; i++) {
			ctx.moveTo(l(0), l(i));
			ctx.lineTo(l(14), l(i));
			ctx.moveTo(l(i), l(0));
			ctx.lineTo(l(i), l(14));
		}
		ctx.closePath();
		ctx.strokeStyle = 'saddlebrown'
		ctx.stroke();
		ctx.restore()
		circle(7, 7)
		circle(3, 3)
		circle(11, 3)
		circle(3, 11)
		circle(11, 11)
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				kong[i+'_'+j] = true
			}
		}
	}
	qiPan()
		///////////////棋子//////////////
	function qizi(x, y, color) {
		ctx.save()
		ctx.translate(l(x), l(y))
		ctx.beginPath()
		var one = ctx.createRadialGradient(0, 0, br, -4, -8, 2)

		if(color == 'black') {
			one.addColorStop(0.2, 'black')
			one.addColorStop(0.8, '#cccccc')
			one.addColorStop(1, 'white')
		} else {

			one.addColorStop(0.2, '#cccccc')
			one.addColorStop(0.8, 'white')
			one.addColorStop(1, 'white')
		}
		ctx.fillStyle = one
		ctx.arc(0, 0, br, 0, Math.PI * 2)
		ctx.shadowOffsetX = 2 //x
		ctx.shadowOffsetY = 3 //y
		ctx.shadowColor = '#888888' //阴影颜色
		ctx.shadowBlur = 3 //阴影大小
		ctx.closePath()
		ctx.fill()
		ctx.restore()
		qzwz[x + '_' + y] = color
		delete kong[m(x,y)];
	}
	///////////////计时///////////////
	var clock = $('#clock').get(0);
	var d = 0

	function sZhen(can) {
		var ctx1 = can.getContext('2d');
		ctx1.clearRect(0, 0, 200, 200)
		ctx1.save();
		ctx1.translate(100, 100);
		ctx1.lineWidth = 2
		ctx1.rotate(Math.PI / 180 * 6 * d)
		ctx1.beginPath();
		ctx1.arc(0, 0, 4, 0, Math.PI * 2);
		ctx1.moveTo(0, 4);
		ctx1.lineTo(0, 10);
		ctx1.moveTo(0, -4);
		ctx1.lineTo(0, -50);
		ctx1.closePath();
		ctx1.strokeStyle = '#000000'
		ctx1.stroke();
		ctx1.restore();
		d += 1
		if(d == 61) {
			d = 0
		}
	}
	sZhen(clock)
	var fir = 0
	var sec = 0
	var t1 = setInterval(function() {
		if(flag2) {
			if(kg1) {
				fir += 1
				var s = fir % 60
				s = (s < 10) ? ('0' + s) : s
				var m = Math.floor(fir / 60)
				m = (m < 10) ? ('0' + m) : m
				$('.first').html(m + ":" + s)
			}
		}
	}, 1000)
	var t2 = setInterval(function() {
			if(flag2) {
				if(kg2) {
					sec += 1
					var s = sec % 60
					s = (s < 10) ? ('0' + s) : s
					var m = Math.floor(sec / 60)
					m = (m < 10) ? ('0' + m) : m
					$('.secend').html(m + ":" + s)
				}
			}
		}, 1000)
		/////////////AI///////////////////
		function intal(){
			var max=-Infinity;
			var pos={}
			for (var k in kong){
				var x=parseInt(k.split('_')[0]);
				var y=parseInt(k.split('_')[1]);
				var m=panduan(x,y,'black')
				if(m>max){
					max=m;
					pos={x:x,y:y};
				}
			}
			var max2=-Infinity;
			var pos2={}
			for (var k in kong){
				var x=parseInt(k.split('_')[0]);
				var y=parseInt(k.split('_')[1]);
				var m=panduan(x,y,'white')
				if(m>max2){
					max2=m;
					pos2={x:x,y:y};
				}
			}
			console.log(max,max2)
			if(max>max2){
				return pos;
			}else{
				return pos2;
			}
		}
		///////////////点击落子///////////
	var flag = true;
	var flag2 = false;
	var kg1 = true
	var kg2 = true
	function dorpif(e){
		starttime='play'
		var x = Math.floor(e.offsetX / sep)
		var y = Math.floor(e.offsetY / sep)
		if(qzwz[x + '_' + y]) {
			return;
		}
		if(AI){
			audio.currentTime = 0
			audio.play()
			qizi(x, y, 'black')
			$('.s-img').show()
			$('.f-img').hide()
			flag2=true
			kg1 = true
			kg2 = false
			if(panduan(x, y, 'black') == 5) {
				$('.end').fadeIn().find('h3').html('黑方胜')
				chessmanual('.end')
				$(canvas).off('click')			
			}
			var p=intal()
			qizi(p.x,p.y, 'white')
			$('.f-img').show()
			$('.s-img').hide()
			if(panduan(p.x, p.y, 'white') == 5) {
				$('.end').fadeIn().find('h3').html('白方胜')	
				chessmanual('.end')
				$(canvas).off('click')
			}
			return false
		}
		if(flag) {
			audio.currentTime = 0
			audio.play()
			qizi(x, y, 'black')
			$('.s-img').show()
			$('.f-img').hide()
			kg2 = true
			kg1 = false
			if(panduan(x, y, 'black') == 5) {
				$('.end').fadeIn().find('h3').html('黑方胜')
				chessmanual('.end')
				$(canvas).off('click')			
			}
		} else {
			audio.currentTime = 0
			audio.play()
			qizi(x, y, 'white')
			$('.f-img').show()
			$('.s-img').hide()
			kg1 = true
			kg2 = false
			if(panduan(x, y, 'white') == 5) {
				$('.end').fadeIn().find('h3').html('白方胜')	
				chessmanual('.end')
				$(canvas).off('click')
			}
		}
		flag = !flag
		flag2 = true
		d = 0
	}
	$(canvas).on('click',function(e){
		dorpif(e)
	})
	var t = setInterval(function() {
			if(flag2) {
				sZhen(clock)
			}
		}, 1000)
		///////////////输赢判断//////////////
	function m(a, b) {
		return a + '_' + b
	}

	function panduan(x, y, color) {
		////横向////
		var row = 1
		var i = 1;
		while(qzwz[m(x + i, y)] == color) {
			row++;
			i++
		}
		i = 1
		while(qzwz[m(x - i, y)] == color) {
			row++;
			i++
		}
		////纵向/////
		var lie = 1
		i = 1;
		while(qzwz[m(x, y + i)] == color) {
			lie++;
			i++
		}
		i = 1
		while(qzwz[m(x, y - i)] == color) {
			lie++;
			i++
		}
		////左斜////
		var zX = 1
		i = 1;
		while(qzwz[m(x + i, y + i)] == color) {
			zX++;
			i++
		}
		i = 1
		while(qzwz[m(x - i, y - i)] == color) {
			zX++;
			i++
		}
		////右斜////
		var yx = 1
		i = 1;
		while(qzwz[m(x + i, y - i)] == color) {
			yx++;
			i++
		}
		i = 1
		while(qzwz[m(x - i, y + i)] == color) {
			yx++;
			i++
		}
		return Math.max(row, lie, zX, yx)

	}
	//////////////重新开始////////////
	$('#re').on('click', function() {
		$('.sure').fadeIn()
	})
	$('#sz').on('click', function() {
		$('.manual').fadeIn()
		chessmanual('.manual')
	})
	$('.close').on('click',function(){
		qiPan()
		for(var k in qzwz){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			qizi(x,y,qzwz[k])
		}
		$('.manual').find('img').remove()
		$('.manual').find('a').remove()
		$('.manual').fadeOut()
	})
	function newgame() {
		ctx.clearRect(0, 0, 600, 600)
		qiPan()
		qzwz = {};
		d = 0
		sZhen(clock)
		fir = 0
		sec = 0
		flag = true
		flag2 = false
		kg1 = true
		kg2 = true
		$('.first').html('00:00')
		$('.secend').html('00:00')
		$('.f-img').show()
		$('.s-img').hide()
		$('.sure').fadeOut()
		$('.end').find('img').remove()
		$('.end').find('a').remove()
		$(canvas).on('click',function(e){
			dorpif(e)
		})
		starttime='pause'
	}
	///////////点击事件
	$('#yes').on('click', function() {
		newgame()
	})
	$('#no').on('click', function() {
		$('.sure').fadeOut()
	})
	$('#again').on('click',function(){
		$('.end').fadeOut()
		newgame()
	})
	$('#look').on('click',function(){
		$('.end').fadeOut()
		
	})
	$('#chms').on('click',function(){
		if(starttime==='play'){
			return
		}
		$('.chose').fadeIn()
	})
	$('#ai').on('click',function(){
		if(starttime==='play'){
			return
		}
		AI=true;
		$(this).addClass('active')
		$('#people').removeClass('active')
		$('.chose').fadeOut()
		$('#chms').html('玩家 VS 电脑')
	})
	$('#people').on('click',function(){
		if(starttime==='play'){
			return
		}
		AI=false;
		$(this).addClass('active')
		$('#ai').removeClass('active')
		$('.chose').fadeOut()
		$('#chms').html('玩家1 VS 玩家2')
		
	})
		/////////////////封面动画//////////////
	$('#begin').click(function() {
		$('.load').fadeOut('slow')
		$('#audiotwo').get(0).play()
	})
	$('#help').hover(function() {
		$('.help').fadeIn()
	}, function() {
		$('.help').fadeOut()
	})
	//////////////棋谱//////
	function chessmanual(man){
		ctx.save()
		ctx.font='20px/1 微软雅黑'
		ctx.textAlign='center'
		ctx.textBaseline='middle'
		var i=1;
		for (var k in qzwz){
			var arr=k.split('_');
			if(qzwz[k]==='block'){
				ctx.fillStyle='white'
			}else{
				ctx.fillStyle='black'
			}
			ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1])))
		}
		ctx.restore()
		$('<img>').attr('src',canvas.toDataURL()).appendTo(man)
		$('<a></a>').attr('href',canvas.toDataURL()).attr('download','qipu.png').appendTo(man)
	}
})