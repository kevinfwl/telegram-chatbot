const telegraf = require('telegraf');
const crypto = require('./crypto.js');
const BOT_TOKEN = '503692536:AAH3Dhe-qkvWvnGpT0yo54dNQRA-tJxBqBQ';

var bot = new telegraf(BOT_TOKEN);

const invalid_spec = 'invalid specifications. check /help for more info';
const help_reply = 'Welcome to cryptobot!\n' +
    'Cryptobot is design to help you attain up to date information about cryptocurrencies as well as\n' +
    'helping you keep track of the progress of the online trading market.\n' +
    'Commands:\n' +
    '\n' +
    '/search (crpyto name) (spec - optional)\n' +
    '\n' +
    'Searches a specific/general information about the crypto currency, highlighted by crypto name.\n' +
    '\n' +
    '/compare (crypto name 1) (crypto name 2) (spec - optional)\n' +
    '\n' +
    'Compares two crypto currencies generally or in one aspect (with the specification).\n' +
    '\n' +
    'Specs:\n' +
    'Specifications specifc informations about a crpyto. The available specifications are\n' +
    'listed below.\n' +
    '\n' +
    'price - price of the cryptocurrency in USD\n' +
    'symbol - symbol of the cryptocurrency\n' +
    '24hvolume - the volume that is circulating in the market for the last 24 hr\n' +
    'marketcap - total amount of crypto that is in the market\n' +
    'total_supply - the upper limit of crpyto that can be traded in max supply\n' +
    'available_supply - the supply that is currently available\n' +
    '1h - % change in price in the past hour\n' +
    '1d - % change in price in the past day\n' +
    '7d - % change in price in the past week\n' +
    '\n' +
    'Example: to find the price of bitoin one can use the command\n' +
    '[/search bitcoin price]\n' +
    '\n' +
    'More features will be implemented shortly...\n';


const dont_understand_reply = 'i don\'t understand what you mean. please enter a valid input or type /help for more instructions';

bot.start(function (ctx) {
    console.log('started:', ctx.from.id);
    return ctx.reply('Welcome!');
})

bot.command('help', function (ctx) {
    ctx.reply(help_reply);
    console.log('replied');
})

bot.command('search', function (ctx) {
    var messages = toLowerCase_Array(ctx.message.text.split(' '));
    console.log(messages[3]);

    Promise.resolve(crypto.search_bitcoin(messages[1], messages[2])).then(function (value) {
        console.log(typeof value);
        if (typeof value === 'object') {
            let print_message = value.name + ' (' + value.symbol + ')' + '\n' +
                'price (USD): $' + returnUnavailable(value.price_usd) + '\n' +
                '1h change: ' + returnUnavailable(value.percent_change_1h) + '%' + '\n' +
                '1d change: ' + returnUnavailable(value.percent_change_24h) + '%' + '\n' +
                '7d change: ' + returnUnavailable(value.percent_change_7d) + '%' + '\n' +
                '24h volume: $' + returnUnavailable(value['24h_volume_usd']) + '\n';

            //console.log(print_message);
            ctx.reply(print_message);
        }
        else if (value != crypto.undefined_code) {
            ctx.reply('The ' + messages[2] + ' of ' + messages[1] + ' is ' + value + '.');
        }
        else {
            //console.log(invalid_spec);
            ctx.reply(invalid_spec);
        }
    });
});

bot.command('compare', function (ctx) {
    var messages = toLowerCase_Array(ctx.message.text.split(' '));
    Promise.resolve(crypto.compare_bitcoins(messages[1], messages[2], messages[3])).then(function (value) {
        if (value != crypto.undefined_code) {
            let printed_message = '';
            if (value[2] == 0) {
                printed_message += messages[3] + ' comparison:\n';
            }
            else if (value[2] == 1) {
                printed_message += 'Price comparison:\n';
            }
            printed_message += '------------------------------\n' +
                messages[1] + ': ' + value[0] + '\n' +
                messages[2] + ': ' + value[1] + '\n';
                ctx.reply(printed_message);
        }
        else {
            ctx.reply(invalid_spec);
        }
    });
});

bot.command('rank', function (ctx) {
    ctx.reply('not implemented yet!');
});

bot.command('addfollow', function (ctx) {
    ctx.reply('not implemented yet!');
});

bot.hears('hello', function (ctx) {
    ctx.reply('Hello to you too. Cryptocurrency is the future, buy crypto!');
});

bot.on('text', function (ctx) {
    ctx.reply(dont_understand_reply);
});

bot.on('sticker', function (ctx) {
    ctx.reply('Hey Jude, Don\'t make it bad, take a sad song, and make it better :)');
});

bot.catch(function (error) {
    console.log('an error has occured');
});

bot.startPolling();


//non bot related functions
function returnUnavailable(obj) {
    if (obj == null) {
        return 'unavailable';
    }
    else {
        return obj;
    }
}

function toLowerCase_Array(array) {
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].toLowerCase();
    }
    return array;
}
