import { Injectable } from '@angular/core';
import { DatabaseType } from 'src/app/lib/interface';
import { toArray, uuid } from 'src/app/lib/minitools';
const _DB_KEY='database'
const _COMMIT_DEFAULT=false;
type SubscribeCallback<T extends Db>=(changes:T[],removes:T[])=>any;
interface SubscribeData<T extends Db>{
  // id:string;
  callback:SubscribeCallback<T>;
  queries:QueryData[];
  tbl:string;
}

interface  DbType<T>{
  [id:string]:T[]
}
@Injectable({
  providedIn: 'root'
})
export class LocalDatabaseService {
  db:any={}
  subscribes:SubscribeData<any>[]=[];
  constructor() {
    this._restore();
   }
  async add<T extends Db>(tbl:string,data:T,isCommit:boolean=_COMMIT_DEFAULT):Promise<T>{
    let db=this.db[tbl];
    if(!db){
      db=this.db[tbl]={}
    }
    let {id,...rawData}=data;
    id=id||uuid();
    db[id]=rawData;
    if(isCommit) this._backup();
    return JSON.parse(JSON.stringify({...rawData,id}))
  }

  async get<T extends Db>(tbl:string,id:string):Promise<T|undefined>{
    let db=this.db[tbl]||{};
    const data:T|undefined=db[id]
    return this._separateData(data);
  }

  /**
   * The `monitor` function allows subscribing to changes in a database table and provides a callback
   * function to handle the changes.
   * @param {string} tbl - The `tbl` parameter is a string that represents the name of the database
   * table that you want to monitor for changes.
   * @param callback - The `callback` parameter is a function that will be called whenever there is a
   * change in the specified database table (`tbl`). It will be passed the updated data as an argument.
   * @param {QueryData[]} queries - The `queries` parameter is a rest parameter that allows you to pass
   * in an array of `QueryData` objects. Each `QueryData` object represents a query that you want to
   * subscribe to.
   * @returns a callback function that can be used to unsubscribe from the monitoring.
   */
  monitor<T extends Db>(tbl:string,callback:SubscribeCallback<T>,...queries:QueryData[]){
    let pos=this.subscribes.findIndex(x=>x.tbl===tbl && x.callback==callback);
    if(pos===-1) pos=this.subscribes.push({tbl,callback,queries})-1;
    else this.subscribes[pos]={tbl,callback,queries}
    return ()=>{this.subscribes.splice(pos,1)}  //upsubscribe
  }

  commit(){
    this._backup();
  }

  async search<T extends Db>(tbl:string,...queries:QueryData[]):Promise<T[]>{
    const outs:T[]=[];
    const db:DatabaseType<T>=this.db[tbl]||{}
    const datas:T[]=Object.keys(db).map(key=>db[key] as T)
    if(!queries.length) return this._separateData(datas);
    datas.forEach(data=>{
        if(checkQuery(queries,data)) outs.push(this._separateData(data))
    })
    return outs;
  }

  async del<T extends Db>(tbl:string,ids:string|T|(string|T)[]):Promise<string[]>{
    const db=this.db[tbl]||{}
    const outs:string[]=[]
    toArray(ids).forEach(item=>{
      const id=typeof item==='string'?item:item.id
      const data=db[id];
      if(!data) return;
      delete db[id];
      outs.push(id)
    })
    return outs;
  }

  ///////// private //////////

  private _backup(){
    const data=JSON.stringify(this.db);
    localStorage.setItem(_DB_KEY,data)
  }

  private _restore(){
    try{
      const str=localStorage.getItem(_DB_KEY);
      if(!str) return;
      this.db=JSON.parse(str);
    }
    catch(err){
      console.log("restore data is err ",err);
    }
  }

  private _separateData(data:any):any{
    if(data===undefined) return data;
    return JSON.parse(JSON.stringify(data))
  }
}


//////////////// MINITOOLS ////////////////////
export function checkQuery(queries:QueryData|QueryData[],data:any):boolean{
  const _queries:QueryData[]=Array.isArray(queries)?queries:[queries];
  return _queries.every(
      ({key,value,type})=>{
          let _data=data[key];
          if(_data==undefined) return false;
      switch(type){
          case '==': return value===_data;
          case '!=': return value!==_data;
          case '<=': return _data<=value;
          case '>=': return _data>=value;
          case 'in': return value.includes(_data);
          case 'not-in': return !value.includes(_data);
          case 'array-in': return _data.includes(value);
          case 'array-not-in': return !_data.includes(value);
          case '>': return _data>value;
          case '<': return _data<value;
          default:
              console.warn("out of case, type:",type);
              return false;

      }
  })
}

//////////////// INTERFACE ////////////////////
export interface Db{id:string}

export interface QueryData{
  type:QueryDataType;
  key:string;
  value:any;
}
export type QueryDataType='=='|'>='|'>'|'<'|'<='|'!='|'in'|'not-in'|'array-in'|'array-not-in';
type DataChangeType="add"|"update"|"delete"|"none"