import * as tool from '../../utils';
import awardImageUrl from '../../../../resource/img/award-icon.png';

class Roulette {
    constructor({ ctx, canvas, awards, resultIdx, onEnd }) {

        this.awardImg = new Image();
        this.awardImg.src = awardImageUrl;

        this.ctx = ctx;
        this.canvas = canvas;
        this.awards = awards; // 奖项
        this.resultIdx = resultIdx; // 需要命中的奖项所在的index
        this.onEnd = onEnd; // 转盘结束后的回调函数

        this.PI = Math.PI;

        // 每一个奖项块的颜色
        this.awardsColors = ["#fff", "#fff"];
        this.endColor = '#FFEAD6';
        // 奖品数
        this.awardCount = this.awards.length;
        // 每一个奖品块的角度
        this.perAwardAngle = this.PI * 2 / this.awardCount;
        // 圆的半径
        this.radius = this.canvas.height / 2;
       
        // 圆心坐标
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

         // 文字半径
        this.textRadius = this.radius * 2 / 3;
        // 字体大小
        this.fontSize = 12 * tool.getPixelRatio(this.ctx);

        // 奖品的半径
        this.awardImgRadius = this.textRadius * 3 / 4;

        // 起始角度
        this.startAngle = 0;

        // 随机一个执行时间: 5000ms - 10000ms
        this.duration = Math.floor((5 + Math.random() * 5) * 1000);

        // 最终结束时的角度
        this.resAngle = this.calResAngle(this.resultIdx, this.perAwardAngle);
    }

    // 生成 n - m 的随机数
    getRandomNumber(n, m){
        return n + Math.random() * (m - n);
    }

    drawWheel(showRes = false) {
        this.awards.forEach((item, idx) => {

            const isResult = showRes && idx === this.resultIdx;

            // 画转盘
            const startAngle = this.startAngle + idx * this.perAwardAngle;
            const endAngle = startAngle + this.perAwardAngle;
            const style = this.awardsColors[idx % 2];
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, false);
            this.ctx.fillStyle = style;
            if(isResult){
                this.ctx.fillStyle = this.endColor;
            }
            this.ctx.strokeStyle = style;
            this.ctx.closePath();
            this.ctx.setLineDash([10, 10]);
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = '#FF8919';
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.restore();

            // 画文字
            this.ctx.save();
            const textX = this.x + this.textRadius * Math.cos(startAngle + this.perAwardAngle / 2);
            const textY = this.y + this.textRadius * Math.sin(startAngle + this.perAwardAngle / 2);            
            this.ctx.translate(textX, textY);
            
            this.ctx.font = `bold ${this.fontSize}px Microsoft YaHei`;
            this.ctx.fillStyle = '#F54710';

            // 设置文字跟随区块进行翻转
            this.ctx.rotate(startAngle + this.perAwardAngle / 2 + this.PI / 2);

            this.ctx.fillText(item, -this.ctx.measureText(item).width / 2, 0);

            this.ctx.restore();

             // 画奖品icon
             if(isResult) {
                this.ctx.save();
                const imgX = this.x + this.awardImgRadius * Math.cos(startAngle + this.perAwardAngle / 2);
                const imgY = this.y + this.awardImgRadius * Math.sin(startAngle + this.perAwardAngle / 2);
                this.ctx.translate(imgX, imgY);
                // 旋转
                this.ctx.rotate(startAngle + this.perAwardAngle / 2 + this.PI / 2);

                this.ctx.drawImage(this.awardImg, -16, 0, 32, 20);
                this.ctx.restore();
            }

        });
    }

    calResAngle(resultIdx, perAwardAngle){
        const startAngle = resultIdx * perAwardAngle;
        const endAngle = (resultIdx + 1) * perAwardAngle;
        const targetAngle = 1.5 * this.PI;
        // 转动圈数，随机 20 - 30圈
        const roundCount = Math.floor(this.getRandomNumber(7, 15));
        let maxAngle = undefined;
        let minAngle = undefined;
        if(startAngle < targetAngle) {
            minAngle = Math.abs(targetAngle - endAngle);
            maxAngle = targetAngle - startAngle;
        } else {
            minAngle = 2 * this.PI - endAngle + targetAngle;
            maxAngle = 2 * this.PI - startAngle + targetAngle;
        }
        const buffer = this.PI / 30;
        minAngle += roundCount * 2 * this.PI + buffer;
        maxAngle += roundCount * 2 * this.PI - buffer;
        return this.getRandomNumber(minAngle, maxAngle);
    }

    // 主函数
    fire() {

        if (!this.firstFrameTime) {
            this.firstFrameTime = Date.now();
        }
        const curFrameTime = Date.now();
        const percentDone = (curFrameTime - this.firstFrameTime) / this.duration;
        if (percentDone >= 1) {
            this.onEnd && this.onEnd();
            this.drawWheel(true);
            return;
        }

        this.startAngle = tool.ease(0, this.resAngle, percentDone);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWheel();
        window.requestAnimationFrame(this.fire.bind(this));
    }

    reset(){
        this.startAngle = 0;
        this.resAngle = this.calResAngle(this.resultIdx, this.perAwardAngle);
        this.firstFrameTime = undefined;
    }
}

export default Roulette;