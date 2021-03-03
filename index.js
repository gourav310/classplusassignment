const assert = require('assert');
const { userModel, connect } = require('./db.js')
/**
 * Requirements:
 *
 * If a user enters three wrong passwords consecutively 3 times, then BLOCK the USER. Reset in 1 hour
 * If a user enters three wrong passwords within a sliding  time frame of 30 mins, BLOCK the USER.
 *
 * */
//connnect to db
connect()
const SLIDING_WINDOW_MINS = 30;

class LoginResponeEnum {

    static get SUCCESS() {
        return "SUCCESS";
    }

    static get FAIL() {
        return "FAIL";
    }

    static get BLOCKED() {
        return "BLOCKED";
    }

    static get values() {
        return [this.SUCCESS, this.FAIL, this.BLOCKED];
    }

}


class LoginSimulation {

    constructor() {
        // init some stuff
        this.bootstrapUsers();
        //consecutive attempts
        this.consecutiveAttempts = 0;
        //timing to check if its block or not 
        this.timing = new Date();
        ///array of failed attemptys in lastb 30 mins
        this.failedArray=[];
    }

    async bootstrapUsers() {
        // TODO
        // create some users in the in memory database simulation
        //simple db user when connection starts
        const user = new userModel({
            username: "user 1",
            password: "right pass"
        })
        await user.save();
    }

    async doLogin(username, password, date = new Date()) {
        // TODO
        // timing will store on which time you are allowed to login
        //if you are not blocked the it you will be allowed 
        if (this.timing > date) {
            return LoginResponeEnum.BLOCKED;
        }
        //find user in db 
        const user = await userModel.findOne({ username: username }) 
        //password matched go ahead
        if (user.password === password) {
            this.consecutiveAttempts = 0;
            return LoginResponeEnum.SUCCESS;
        } else {
            /// calculatye time of 30 mins before request 
            const before30mins=new Date(+date - 30 * 60 * 1000);
          //  console.log(before30mins);
          //filter the array with time > 30minsbefore
          //it will like getting all request of last 30mins
            const arr = this.failedArray.filter((date0)=>date0>before30mins);
            arr.push(date);
            this.failedArray=[...arr];
            //console.log(this.failedArray)
            this.consecutiveAttempts++;
            //if consevutive attempts are 3 or or more than or equal to 3 requestt in last 30 min block the user 
            if (this.consecutiveAttempts >= 3 || this.failedArray.length>=3) {
                this.timing = new Date(+new Date() + 61 * 60 * 1000);
                this.failedArray=[];
                this.consecutiveAttempts=0;
                return LoginResponeEnum.BLOCKED
            }
            return LoginResponeEnum.FAIL;
        }
    }
    inMins(mins) {
        return new Date(+new Date() + mins * 60 * 1000);
    }

    //i used mongoose for mongo db connection which sends asynchronus requests to database so 
    //here i made use of async await in test cases for the sake of prblem 
    //just to work with async function
    
    
    //  for testing
    async testThreeConsiquitiveFailures() {
        console.log("Testing Three Consequitive wrong passwords");
        assert.equal( await  this.doLogin("user 1", "wrong pass"), LoginResponeEnum.FAIL);
        assert.equal( await this.doLogin("user 1", "wrong pass", this.inMins(20)), LoginResponeEnum.FAIL);
        assert.equal( await this.doLogin("user 1", "wrong pass", this.inMins(25)), LoginResponeEnum.BLOCKED);
        assert.equal( await this.doLogin("user 1", "wrong pass", this.inMins(40)), LoginResponeEnum.BLOCKED);
        assert.equal( await this.doLogin("user 1", "wrong pass", this.inMins(60)), LoginResponeEnum.BLOCKED);
        assert.equal(await this.doLogin("user 1", "right pass", this.inMins(60)), LoginResponeEnum.BLOCKED);
        assert.equal(await this.doLogin("user 1", "wrong pass", this.inMins(150)), LoginResponeEnum.FAIL);    
    }

    async testUserIsBlockedInSlidingTimeFrame() {
        console.log("Testing user is blocked in sliding timeframe0");
        assert.equal(await this.doLogin("user 1", "wrong pass"), LoginResponeEnum.FAIL);
        assert.equal(await this.doLogin("user 1", "right pass", this.inMins(5)), LoginResponeEnum.SUCCESS);
        assert.equal(await this.doLogin("user 1", "right pass", this.inMins(8)), LoginResponeEnum.SUCCESS);
        assert.equal(await this.doLogin("user 1", "wrong pass", this.inMins(20)), LoginResponeEnum.FAIL);    
        assert.equal(await this.doLogin("user 1", "wrong pass", this.inMins(31)), LoginResponeEnum.FAIL);
        assert.equal(await this.doLogin("user 1", "right pass", this.inMins(40)), LoginResponeEnum.SUCCESS);
       
        assert.equal(await this.doLogin("user 1", "wrong pass", this.inMins(44)), LoginResponeEnum.BLOCKED);
        assert.equal(await this.doLogin("user 1", "right pass", this.inMins(45)), LoginResponeEnum.BLOCKED);
        assert.equal(await this.doLogin("user 1", "right pass", this.inMins(110)), LoginResponeEnum.SUCCESS);
    }

}

// Test condition 1
new LoginSimulation().testThreeConsiquitiveFailures();
// // test condition 2
new LoginSimulation().testUserIsBlockedInSlidingTimeFrame();
// const user= new LoginSimulation();
console.log("working")