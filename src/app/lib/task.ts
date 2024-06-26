export class TaskManager{
    _tasks:Function[]=[];
    _finish!:Function;;
   /**
    * The function `push` adds a callback function and its parameters to a list of tasks to be executed
    * asynchronously.
    * @param callback - The callback parameter is a function that will be executed when the push method
    * is called.
    * @param params - The `params` parameter is a rest parameter that allows you to pass any number of
    * arguments to the `callback` function. These arguments will be spread into the `callback` function
    * when it is called.
    * @returns The `push` function is returning the current instance of the object that it is being
    * called on.
    */
    push(callback:Function,...params:any[]){
        const run:Function=async()=>{ 
            await callback(...params);
        }

        this._tasks.push(run);
        return this
    }

    /**
     * The `run` function is an asynchronous function that executes a series of tasks in order,
     * starting from the specified position.
     * @param [pos=0] - The `pos` parameter is the position of the task in the `tasks` array that
     * should be executed next. It is used to keep track of the current task being executed and to
     * determine the next task to be executed recursively.
     * @returns The function does not explicitly return anything.
     */
    private async _run(pos=0){
        console.log("run pos:",pos);
        const task=this._tasks[pos];
        if(!task) {
            if(this._finish) this._finish();
            return;
        }
        await task()
        this._run(pos+1)
    }

    async start(){
        return new Promise((resolve,reject)=>{
            this._finish=()=>resolve('ok');
            this._run();
        })
    }

    cancel(){
        this._tasks=[];//remove tasks
    }

}