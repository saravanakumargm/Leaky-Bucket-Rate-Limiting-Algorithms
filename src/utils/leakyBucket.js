export class LeakyBucket{
    constructor(settings = {}){
        this.capacity  = settings.capacity;
        this.leakRate = settings.leakRate;
        this.interval = settings.interval || 1000;

        this.buckets = new Map();

        this.startLeaking();
    }

    startLeaking(){
        setInterval(() => {
            const now = Date.now();
            for(const [key, state] of this.buckets.entries()){
                const leaked = ((now - state.lastLeak) / 1000) * this.leakRate;
                state.tokens = Math.max(0, state.tokens - leaked);
                state.lastLeak = now;

                if(state.tokens === 0){
                    this.buckets.delete(key);
                }
            }
        }, this.interval);
    }

    isAllowed(identifier){
        let state = this.buckets.get(identifier);
        const now = Date.now();

        if(!state){
            state = { tokens: 0, lastLeak: now};
            this.buckets.set(identifier, state);
        }

        const timePassed = now - state.lastLeak;
        const leaked = (timePassed / 1000) * this.leakRate;
        state.tokens = Math.max(0, state.tokens - leaked);
        state.lastLeak = now;

        if(state.tokens + 1 <= this.capacity){
            state.tokens += 1;
            return {
                allowed: true,
                remaining: this.capacity - state.tokens
            };
        }else{
            return {
                allowed: false,
                remaining: 0
            };
        }
    }

}