const _ = require('lodash')
const Handlebars = require('handlebars')

module.exports = {
    toJSON : (object) => {
        return JSON.stringify(object)
    },
    ifNth : (options) => {
        const index = options.data.index + 1
        const nth = options.hash.nth;
    
        if (index % nth === 0) 
            return options.fn(this);
        else
            return options.inverse(this);

    },
    everyNth : (context, every, options) => {
        let data;
        if (options.data) {
            data = Handlebars.createFrame(options.data);
        }
        const fn = options.fn
        const inverse = options.inverse
        let ret = [];
        if(context && context.length > 0) {
            for(let i=0, j=context.length; i<j; i++) {
                let modZero = i % every === 0;
                data = _.extend({}, data, {
                    isModZero: modZero,
                    isModZeroNotFirst: modZero && i > 0,
                    isLast: i === context.length - 1
                })
                ret = ret + fn(context[i], {data : data});
            }
        } else {
            ret = inverse(this);
        }
        console.log('data', data);
        options.data = data
        // console.log(ret)
        return ret;
    }
}


  
  