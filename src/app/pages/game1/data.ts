export const datas:AlphabetData[]=[
    {n:'a',s:'a',ex:['cái ca','quả cà','con cá']},
    {n:'ă',s:'á',ex:['rau má']},
    {n:'â',s:'ớ'},
    {n:'b',s:'bờ',ex:['con bò','cái bờm','bươm bướm']},
    {n:'c',s:'cờ',ex:['CÁI CỜ']},
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
    {n:'y',s:'i'}
]

export function rand<T>(arrs:T[]):T[]{
    const db:T[]=[...arrs];
    const outs:T[]=[];
    let pos:number=0;
    while(db.length){
        pos=Math.round(Math.random()*(db.length-1));
        console.log("test ",{pos});
        // tmp=db[pos];
        outs.push(db[pos]);
        db.splice(pos,1)
    }
    return outs;
}

export interface AlphabetData{
    n:string;
    s:string;
    ex?:string[];
  }
  