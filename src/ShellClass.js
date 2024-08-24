export class Shell{
    centerX; centerY; radius;
    color;

    constructor(centerX, centerY, radius = 5, color = 'red'){
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = color;
    }

    getPosition(axis = ''){
        if(axis === 'x'){
            return this.centerX;
        }
        if(axis === 'y'){
            return this.centerY;
        }
        return({x : this.centerX, y : this.centerY});
    }

    getRadius(){
        return(this.radius);
    }

    clear(context){
        context.clearRect(this.centerX - this.radius -1 , this.centerY - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
    }

    render(context){
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.stroke();
    }

    move(context, step, direct){
        this.clear(context)
        if(direct == 'right'){ this.centerX += step }
        if(direct == 'left'){ this.centerX -= step }
        this.render(context);
    }
}