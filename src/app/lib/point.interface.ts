export interface PointData{
    id:string;             // id
    correct:number;        // total times
    delay:number;          // thingthing time [second]
    wrong:number;          // number of wrong
}

export class Point{
    points:PointData[]=[]
    constructor(){}
    add(id:string,result:boolean,delay:number){
        const point=this.points.find(x=>x.id===id);
        //not yet
        if(!point){
            this.points.push({
                id,
                delay:result?delay:0,
                correct:result?1:0,
                wrong:result?0:1
            })
            return;
        }

        // exist -- correct word
        if(result){
            point.delay=(point.delay*point.correct+delay)/(point.correct+1);
            point.correct++;
            return;
        }

        // exist -- wrong word
        point.wrong++;
    }

    getWrongList():PointData[]{
        return this.points.filter(x=>x.wrong).sort((a,b)=>a.wrong-b.wrong)
    }

    result(){
        const arrs:PointData[]=this.points.filter(x=>x.delay).sort((a,b)=>b.delay-a.delay);
        let delay:number=0;
        let times:number=0;
        arrs.forEach(arr=>{
            if(!delay) {delay=arr.delay;times++}
            else {
                delay=((delay*times)+(arr.delay*arr.correct))/(times+arr.correct);
                times+=arr.correct;
            }
        })
        return {delay,times,list:arrs}
    }
}

// const _point=arrs.find(x=>x.id===id);
//     // not yet
//     if(!_point){
//         arrs.push({
//             id,
//             delay:result?delay:0,
//             correct:result?1:0,
//             wrong:result?0:1
//         })
//         return;
//     }

//     //exist -- correct word
//     if(result){
//         _point.delay=(_point.delay*_point.correct+delay)/(_point.correct+1);
//         _point.correct++;
//         return;
//     }

//     // exist -- wrong word
//     _point.wrong++;