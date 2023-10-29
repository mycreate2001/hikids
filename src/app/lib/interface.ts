import { createOpt, uuid } from "./minitools";

export const _DB_SETTING="settings"
export const _DB_SETTING_LANGUAGE="language"
export const _DB_SETTING_WORDS="words"

export interface SettingData<T>{
    id:string;
    data:T
}

export interface DatabaseType<T>{
    [id:string]:T
}

export interface GroupOfData<T>{
    group:string;
    data:T
}

///////////////// WORDS /////////////

export interface AlphabetData{
    id:string;
    n:string;
    s:string;
    ex?:string;
    lang:string;
    group:string;
}

export const _DB_WORDS="words"

export function createAlphabetData(opt?:Partial<AlphabetData>):AlphabetData{
    const df:AlphabetData={
        id:uuid(),
        n:'',
        s:'',
        ex:'',
        lang:'vi-VN',
        group:''
    }
    return createOpt(df,opt);
}


export const Languages= [
    {name:'Tiếng Việt',value:'vi-VN'},
    {name:'Tiếng Anh',value:'en-US'},
];