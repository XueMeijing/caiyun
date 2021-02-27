class Wave{
  constructor(){
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.simplex = new SimplexNoise();
    this.speedY = 0;
    this.speedX = 0;
    this.init();
    this.color = colors[Math.floor( Math.random() * 526 )].hex
  }

  init(){
    this.reset();
    this.loop();
  }

  reset(){
    this.w = window.innerWidth + 540;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.count = 50
  }   

  loop(){
    var This = this;
    function drawloop(){
        window.requestAnimationFrame(drawloop);
        This.ctx.clearRect(0,0,This.w,This.h);
        This.speedX = 0;
        This.speedY += Math.random()/200; //每次渲染需要更新波峰波谷值
        //连续绘制三次波浪线
        This.draw(This.color, 200); 
        This.draw(This.color, 160); 
        This.draw(This.color, 130); 
        This.draw(This.color, 70); 
        This.draw(This.color, 20); 
    }

    drawloop();
  }

  draw(color,height){
    var amp = 70; //波浪幅度 可以通过函数传递参数更改不同的幅度
    this.ctx.beginPath();

    for(var i=0;i<=this.count;i++){
        this.speedX += 0.05;
        var x = i*(this.w/this.count);
        var y = this.h/2 + this.simplex.noise2D(this.speedX,this.speedY)*amp-height;
        this.ctx[i === 0 ? 'moveTo' : 'lineTo'](x,y);
    }

    this.ctx.globalAlpha = 0.25;
    this.ctx.fillStyle = color;
    this.ctx.globalCompositeOperation = 'darker';
    this.ctx.imageSmoothingEnabled = 'true';
    this.ctx.lineTo(this.w,-this.h); 
    this.ctx.lineTo(0, -this.h); 
    this.ctx.closePath();
    this.ctx.fill();    
  }
}

new Wave();

window.onresize = function() {
  document.getElementById('canvas').setAttribute("width", document.body.clientWidth)
  document.getElementById('canvas').setAttribute("height", document.body.clientHeight)
}

document.addEventListener("keydown", (event) => {
  var nKeyCode = event.keyCode || event.which
  if(nKeyCode === 83 && event.altKey) {
    html2canvas(document.querySelector("#root")).then(function(canvas) {
      canvas.toBlob(function(blob) {
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        var url = URL.createObjectURL(blob);
        a.download = '彩云'
        a.href = url
        a.dispatchEvent(event)
      });
      console.clear()
    })
  }
})
chrome.storage.local.get("data",function(result){
  var verse= result.data || {content: "当时明月在，曾照彩云归",origin: {title: "临江仙", author: "晏几道"}}
  document.querySelector(".verses-content").innerHTML = verse.content
  document.querySelector(".verses-title").innerHTML = `「${verse.origin.title}」`
  document.querySelector(".verses-stamp").classList.add("verses-stamp-active")
  document.querySelector(".verses-stamp").innerHTML = verse.origin.author
  jinrishici.load(function(result) {
    // 自己的处理逻辑
    var { data={} } = result
    chrome.storage.local.set({data})
  });
})

document.getElementById("setting").addEventListener("click", myFunction);
  function myFunction(){
    if(document.querySelector("#setting").classList.contains('setting-active')) {
      document.querySelector("#setting").classList.remove('setting-active')
      document.querySelector(".setting-content").classList.remove("setting-content-active")
    } else {
      document.querySelector("#setting").classList.add('setting-active')
      document.querySelector(".setting-content").classList.add("setting-content-active")

    }
}