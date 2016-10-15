var Analyser = {
	analyser: {},
	canvas: {},
	rectangles: [],
	init: function(src){
		this.initCanvas();
		this.initPlayer(src);
		this.initAnalyser();
	},
	initCanvas: function(){
		var self = this;
		this.canvas = new fabric.Canvas('canvas');
		this.canvas.selection = false;
		this.canvas.setHeight(window.innerHeight);
	    this.canvas.setWidth(window.innerWidth);
		
		var lineTop = window.innerHeight*0.9;
		var lineLeft = 0 + (window.innerWidth * 0.1);
		var lineRight = window.innerWidth - (window.innerWidth * 0.1);
		var width = window.innerWidth - window.innerWidth * 0.2;

		var rect = function(top, left) {
			var rect = new fabric.Rect({ width: 20, height: 2, fill: '#00FF00', opacity: 0.9, top: top, left: left, 'selectable': false }); 
			return rect;
		}

		var rectNums = Math.round(width / 20);
		for(var i = 0; i < rectNums; i++) {
			var R = rect(lineTop, lineLeft + i * 20);
			this.rectangles.push(R);
			this.canvas.add(R);
		}
		
		window.addEventListener('resize', function(){
			self.canvas.setHeight(window.innerHeight);
			self.canvas.setWidth(window.innerWidth);
		}, false);
	},
	initPlayer: function(src){	
		this.audio = new Audio();
        this.audio.src = src;
        this.audio.controls = true;
        this.audio.autoplay = true;
		this.audio.crossOrigin = "anonymous";
		
		self = this;
		this.audio.addEventListener('canplay', function () {
            if (!self.source) {
                self.source = self.context.createMediaElementSource(self.audio);
                self.source.connect(self.analyser);
                self.analyser.connect(self.node);
                self.node.connect(self.context.destination);
                self.source.connect(self.context.destination);

				setInterval(function(){
					self.analyser.getByteFrequencyData(self.bands);
                    if (!self.audio.paused) {
                        self.updateCanvas();
                    }
				},100);
            }
        });
	},
	initAnalyser: function(){
		AudioContext = window.AudioContext || window.webkitAudioContext;
		this.context = new AudioContext();
        this.node = this.context.createScriptProcessor(2048, 1, 1);
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;
        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
	},
	updateCanvas: function(){
		var self = this;
		this.rectangles.forEach(function(e, i){
			var height = e.height;
			e.animate('height', -self.bands[i], {
			  onChange: self.canvas.renderAll.bind(self.canvas),
			  duration: (50),
			  easing: fabric.util.ease.easeOutBounce
			});
		});
	}
}