
// _____  ___   _      _         ___    __    ___   __   ____  ___ 
//  | |  / / \ | |\/| | |       | |_)  / /\  | |_) ( (` | |_  | |_)
//  |_|  \_\_/ |_|  | |_|__     |_|   /_/--\ |_| \ _)_) |_|__ |_| \


/*

----------------------------------------------------------

Author: Befaci
A utility written in JS!

Version: 1.0.0 (toml@3.0.0)

----------------------------------------------------------

*/

const fs = require('fs');

const toml = require('toml');

class TOML {
    /**
     * @param {fs.PathOrFileDescriptor} file
     */
    constructor(file) {
        this.f = file;
        this.d = {undefined};
    }

    /**
     * @param {Boolean} set
     - set: Stocks data into the **class variable** named `d`
     */
    async parse(set) {
        let _DATA; // init
        try {
            _DATA = await toml.parse(this.f); // parse into json object
        } catch (error) {
            throw new Error(error); // if it fails, is returning a error
        }

        switch (set) {
            case true:
                this.d = _DATA; // set data instead of return (user choice)
                return;
            case false:
                return _DATA; // return it
            default:
                this.parse(false); // if none
                break;
        }

    }
}

module.exports = TOML;