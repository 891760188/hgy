/**
 * 黄国烨H5手势密码,没毛病
 */
//(function(){
	window.hgyLock = function(obj){
		this.lockSum          = obj.lockSum ;//边长
		this.callBack          = obj.callBack ;//回调函数
		this.devicePixelRatio = window.devicePixelRatio || 1; //是设备上物理像素和设备独立像素 和高清屏有关
		this.width            = obj.width || 300;//宽
        this.height           = obj.height || 300;//高
        this.canvasBCor		  = obj.canvasBCor || 'red';//'#305066';	//画布的背景颜色
        this.circleCor		  = obj.circleCor || '#FFF';//'#CFE6FF';	//圆圈的颜色
        this.lineCor		  = obj.lineCor || 'yellow';//'#CFE6FF';	//圆圈的颜色
       // this.pswObj           = new Object() ;
        
        
	}
	/**
	 * 初始化
	 */
	hgyLock.prototype.init = function() {
	 	this.initDom();//组织清楚dom结构
 	    this.canvas = document.getElementById('canvas');//获取dom
        this.ctx = this.canvas.getContext('2d');//获取画笔
        this.createCircle();//画圆形
        this.touchFlag = false;
        this.bindEvent();//绑定事件
	}
	/**
	 * 初始化dom结构
	 */
	hgyLock.prototype.initDom = function(){
  	 	var wrap = document.createElement('div');//画布外层div
        var str = '<h4 id="title" class="title">绘制解锁图案</h4>'+
                  '<a id="updatePassword" style="position: absolute;right: 5px;top: 5px;color:#fff;font-size: 10px;">重置密码</a>';

        wrap.setAttribute('style','position: absolute;top:0;left:0;right:0;bottom:0;');//画布样式
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id','canvas');//画布Id
        canvas.style.cssText = 'background-color:'+this.canvasBCor+';display: inline-block;margin-top: 15px;';//画布样式
        wrap.innerHTML = str;
        wrap.appendChild(canvas);//画布放进外层div
        document.body.appendChild(wrap);//外层div放进body
        var width = this.width ;
        var height = this.height ;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
         // 高清屏锁放
        canvas.height = height * this.devicePixelRatio;//画布的高
        canvas.width = width * this.devicePixelRatio;//画布的宽
	}
	/**
	 * 圆圈的数据信息 并且调用画圆圈的方法画圆圈
	 */
 	hgyLock.prototype.createCircle = function() {// 创建解锁点的坐标，根据canvas的大小来平均分配半径
        var n = this.lockSum; //一行几个
        var count = 0;//一共几个
        this.r = this.ctx.canvas.width / (2 + 4 * n);// 公式计算 半径和canvas的大小有关 外侧加一个圆
        this.lastPoint = [];
        this.arr = [];
        this.restPoint = [];
        var r = this.r;//圆的半径
        for (var i = 0 ; i < n ; i++) {
            for (var j = 0 ; j < n ; j++) {
                count++;
                var obj = {
                    x: j * 4 * r + 3 * r,//x坐标   每个圆距离4个r
                    y: i * 4 * r + 3 * r,//y坐标
                    index: count//第几个，从0开始
                };
                this.arr.push(obj);//所有圆的圆心坐标
                this.restPoint.push(obj);
            }
        }
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);//画布画出来一个矩形
        for (var i = 0 ; i < this.arr.length ; i++) {
            this.drawCle(this.arr[i].x, this.arr[i].y);//画圆圈
        }
        //return arr;
    }
 	/**
 	 * 	画圆圈
 	 * @param {Object} x 圆心坐标
 	 * @param {Object} y 圆心坐标
 	 */
 	hgyLock.prototype.drawCle = function(x, y) { 
        this.ctx.strokeStyle =  this.circleCor;//圆圈周的颜色，和背景想衬托，像是白色
        this.ctx.lineWidth = 2;//圆周的厚度
        this.ctx.beginPath();//起始一条路径，或重置当前路径。
        this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);//创建弧/曲线（用于创建圆形或部分圆）。
        this.ctx.closePath();//创建从当前点回到起始点的路径。
        this.ctx.stroke();//绘制已定义的路径。
    }
 	/**
 	 * 绑定事件
 	 */
 	hgyLock.prototype.bindEvent = function() {
        var self = this;
        this.canvas.addEventListener("touchstart", function (e) {//用户将某个触摸点置于触摸界面上-事件  开始触摸
            e.preventDefault();// 某些android 的 touchmove不宜触发 所以增加此行代码  避免事件冒泡
             var po = self.getPosition(e);//取出画布上的点
             console.log(po);
             for (var i = 0 ; i < self.arr.length ; i++) {
                if (Math.abs(po.x - self.arr[i].x) < self.r && Math.abs(po.y - self.arr[i].y) < self.r) {//在圆圈内
                    self.touchFlag = true;
                    self.drawPoint(self.arr[i].x,self.arr[i].y);//调用画小圆的方法，其实第一次并没有画
                    self.lastPoint.push(self.arr[i]);//该画的圆
                    self.restPoint.splice(i,1);//去除该点
                    break;
                }
             }
         }, false);
         //触摸点移动
         this.canvas.addEventListener("touchmove", function (e) {
            if (self.touchFlag) {//第一出点是在圆内
                self.update(self.getPosition(e));
            }
         }, false);
         //触摸点离开了触摸区域
         this.canvas.addEventListener("touchend", function (e) {
             if (self.touchFlag) {
                 self.touchFlag = false;
                 self.storePass(self.lastPoint);
                 //让画布恢复到还没画的风格
                 setTimeout(function(){
                 	self.createCircle();
                }, 300);
             }


         }, false);

         document.getElementById('updatePassword').addEventListener('click', function(){
             self.updatePassword();
          });
    }
 	/**
 	 * 	获取touch点相对于canvas的坐标
 	 * @param {Object} e
 	 */
 	hgyLock.prototype.getPosition = function(e) { 
        var rect = e.currentTarget.getBoundingClientRect();
        var po = {
            x: (e.touches[0].clientX - rect.left)*this.devicePixelRatio,
            y: (e.touches[0].clientY - rect.top)*this.devicePixelRatio
          };
        return po;
    }
 	/**
 	 * 画圆内部被触发后的效果     一半圆
 	 */
 	hgyLock.prototype.drawPoint = function() { // 初始化圆心
        for (var i = 0 ; i < this.lastPoint.length ; i++) {
            this.ctx.fillStyle = this.lineCor;//滑动线的颜色
            this.ctx.beginPath();
            this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r / 2, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
 	/**
 	 * 核心变换方法在touchmove时候调用
 	 * @param {Object} po
 	 */
 	hgyLock.prototype.update = function(po) {
 		//清除画布上的内容
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		// 每帧先把面板画出来
        for (var i = 0 ; i < this.arr.length ; i++) { 
            this.drawCle(this.arr[i].x, this.arr[i].y);
        }
		//画圆心
        this.drawPoint(this.lastPoint);
        //画连接线
        this.drawLine(po , this.lastPoint);
		//滑入圆圈要画点，但是去除已经滑过的点
        for (var i = 0 ; i < this.restPoint.length ; i++) {
            if (Math.abs(po.x - this.restPoint[i].x) < this.r && Math.abs(po.y - this.restPoint[i].y) < this.r) {
                this.drawPoint(this.restPoint[i].x, this.restPoint[i].y);
                this.lastPoint.push(this.restPoint[i]);
                this.restPoint.splice(i, 1);
                break;
            }
        }
    }
 	/**
 	 *  画解锁轨迹线
 	 * @param {Object} po  当前点
 	 * @param {Object} lastPoint 路径数组
 	 */
 	hgyLock.prototype.drawLine = function(po, lastPoint) {// 解锁轨迹
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
        console.log(this.lastPoint.length);
        for (var i = 1 ; i < this.lastPoint.length ; i++) {
            this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
        }
        this.ctx.lineTo(po.x, po.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
 	/**
 	 * 	touchend结束之后对密码和状态的处理
 	 * @param {Object} psw
 	 */
 	hgyLock.prototype.storePass = function(psw) {
 		var passwordArray = new Array();
        for(i = 0 ; i < psw.length ; i++){
        	passwordArray.push(psw[i].index);
        }
        this.callBack(passwordArray);
    }
//})();
