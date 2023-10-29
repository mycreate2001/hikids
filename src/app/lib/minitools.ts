import { GroupOfData } from "./interface";

export function uuid():string{
    return Math.random().toString(36).substring(2)+"-"+Date.now().toString(36);
}

export function toArray<T>(arr:T|T[]):T[]{
    return Array.isArray(arr)?arr:[arr]
}

export function getList(arr:any[]|any,key:string):string[]{
    const outs:string[]=[]
    toArray(arr).forEach(data=>{
        const val=data[key]||""
        if(!outs.includes(val+"")) outs.push(val+"")
    })
    return outs
}

export function makeGroup<T>(arrs:T[],key:string):GroupOfData<T[]>[]{
    const groups:string[]=getList(arrs,key)
    return groups.map(group=>{
        const data:T[]=arrs.filter(arr=>(arr as any)[key]==group);
        return {group,data}
    })
}


export function createOpt<T extends object>(df:T,opt?:Partial<T>):T{
    if(opt===undefined) return Object.assign({},df)
    const out:any={};
    Object.keys(df).forEach(key=>{
        const val=(opt as any)[key];
        out[key]=val===undefined?(df as any)[key]:val
    })
    return out
}