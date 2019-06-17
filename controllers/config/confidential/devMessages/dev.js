const colors = ["\x1b[0m", "\x1b[1m","\x1b[4m","\x1b[5m","\x1b[31m", "\x1b[32m","\x1b[33m","\x1b[34m", "\x1b[35m","\x1b[36m","\x1b[37m","\x1b[40m","\x1b[41m","\x1b[42m","\x1b[43m","\x1b[44m","\x1b[45m","\x1b[46m"]



let randomOutput = Math.floor(Math.random()*18);



let messageArray = [{
    msg:
    'Hey there new developer you are probably excited that you got this job congrats!!! \n\n But there are things you should know about this company if its still around. \n First off make sure you have a plan because chances are that you will be the only person that is dealing with this application for everything which sucks i know but thats what they do. \n My time working for them was ok for a little bit until i wanted a raise/increase in pay that they promised me.... They wont give you what you are owed my friend because well they tricked you so that they get high quality work for dirt cheap. \n Be prepared to have someone micro manage you and give you problems for every little thing you do because they do not  "trust" you oh and will try to hack into your personal computer to see what you are doing through their isp so make sure u have a vpn of sorts and watch out for any hidden cameras..... yah i had that.\n This is a node.js application that uses express, mongoDB and ejs as a viewing template also i did not sign a non disclosure so neither should you because u get no benefits and well u know the pay... trust me u can get a much better deal \n\n please continue to add messages to this array if you do continue to work here for future developers.',
    color: colors[randomOutput]
},

]




const DeveloperMessage = () => {
    messageArray.forEach(log => {
        console.log(log.color, `${log.msg}`);
    })
}

DeveloperMessage();
console.log(randomOutput);