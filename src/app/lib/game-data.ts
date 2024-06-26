import { AlphabetData } from "./interface";
import { uuid } from "./minitools";

export const datas:AlphabetData[]=[
    {n:'a',s:'a',ex:'cái ca, quả cà,con cá'},
    {n:'ă',s:'á',ex:'rau má'},
    {n:'â',s:'ớ'},
    {n:'b',s:'bờ',ex:'con bò, cái bờm,bươm bướm'},
    {n:'c',s:'cờ',ex:'CÁI CỜ'},
    {n:'d',s:'dờ'},
    {n:'đ',s:'đờ'},
    {n:'e',s:'e'},
    {n:'ê',s:'ê'},
    {n:'g',s:'gờ'},
    {n:'h',s:'hờ'},
    {n:'i',s:'i'},
    {n:'k',s:'ca'},
    {n:'l',s:'lờ'},
    {n:'m',s:'mờ'},
    {n:'n',s:'nờ'},
    {n:'o',s:'o'},
    {n:'ô',s:'ô'},
    {n:'ơ',s:'ơ'},
    {n:'p',s:'pờ'},
    {n:'q',s:'quờ'},
    {n:'r',s:'rờ'},
    {n:'s',s:'sờ'},
    {n:'t',s:'tờ'},
    {n:'u',s:'u'},
    {n:'ư',s:'ư'},
    {n:'v',s:'vờ'},
    {n:'x',s:'xờ'},
    {n:'y',s:'Y'},
    {n:'ch',s:'chờ'},
    {n:'gh',s:'gờ'},
    {n:'gi',s:'gi'},
    {n:'kh',s:'khờ'},
    {n:'ng',s:'ngờ'},
    {n:'ngh',s:'nghờ'},
    {n:'nh',s:'nhờ'},
    {n:'th',s:'thờ'},
    {n:'tr',s:'trờ'},
    {n:'qu',s:'quờ'}
].map(item=>Object.assign(item,{id:uuid(),lang:'vi-VN',group:'Cơ bản'}))
//ch, gh, gi, kh, ng, ngh, nh, th, tr, qu

export const colors=[
    '#67a7ee',
    '#8cee67',
    '#7867ee',
    '#ee67ea',
    '#997042',
    '#eeae67'
]

//////////////////// function ///////////////////////
export function rand<T>(arrs:T[]):T[]{
    const db:T[]=[...arrs];
    const outs:T[]=[];
    let pos:number=0;
    while(db.length){
        pos=Math.round(Math.random()*(db.length-1));
        // tmp=db[pos];
        outs.push(db[pos]);
        db.splice(pos,1)
    }
    return outs;
}

export function pickup<T>(arrs:T[],length:number,cpos?:number):T[]{
    const _arrs:T[]=[...arrs];
    if(cpos!==undefined) _arrs.splice(cpos,1);
    const outs:T[]=[];
    let pos:number=0;
    for(let i=0;i<length;i++){
        pos=Math.round(Math.random()*(_arrs.length-1))
        outs.push(_arrs[pos])
        _arrs.splice(pos,1)
    }
    console.log("pickup:",outs);
    return outs;
}

/////////////// interface /////////////////////////////
  