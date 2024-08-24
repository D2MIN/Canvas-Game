export class Circle{
    color;
    centerX;
    centerY;
    radius;

    constructor(color = 'green', centerX = 70, centerY = 50, radius = 50){
        this.centerX = centerX;
        this.centerY = centerY;
        this.color = color;
        this.radius = radius;
    }

    render(ctx){
        ctx.beginPath();
        ctx.arc(this.centerX,this.centerY, this.radius, 0 ,2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }

    move(ctx, step){
        ctx.clearRect(this.centerX - this.radius - 1, this.centerY - this.radius - 1 , this.centerX + this.radius, this.centerY + this.radius);
        this.centerY += step;
        ctx.beginPath();
        ctx.arc(this.centerX,this.centerY, this.radius, 0 ,2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }

    getPosition(){
        return {centerX: this.centerX, centerY:this.centerY, radius : this.radius}
    }
}