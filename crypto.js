const request = require('request');
const undefined_code = '000000';

const general_URL = 'https://api.coinmarketcap.com/v1/ticker/';
const currencies = ["AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY",
    "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];

function search_bitcoin(c_name, subtype) {
    let target_URL = general_URL + c_name + '/';
    subtype = Command_to_URL(subtype);

    return new Promise((resolve, reject) => {              
        request(target_URL , function (error, response, body) {
            let importedJSON;  
            if (!error && response.statusCode == 200) {
                importedJSON = JSON.parse(body)[0];
                //console.log(importedJSON);
            }
            else {
                //console.log('JSON not available');
                resolve(undefined_code);
            }

            if (subtype != undefined_code) {
                if (importedJSON.hasOwnProperty(subtype)) {
                    console.log(importedJSON[subtype]);
                     resolve(importedJSON[subtype]);
                }
                else {
                    //console.log('subtype not in JSON');
                    resolve(undefined_code);
                }
            }
            else {
                //console.log('subtype undefined');
                resolve(importedJSON);
            }
        });
    });
}

//search_bitcoin('bitcoin', 'price');

function compare_bitcoins(c_name1, c_name2, subtype) {
    let target_URL1 = general_URL + c_name1 + '/';
    let target_URL2 = general_URL + c_name2 + '/';
    subtype = Command_to_URL(subtype);
    
    return new Promise((resolve, reject) => { 
        console.log(subtype);
        request(target_URL1, function (err, res, body) {
            let JSON1;
            let JSON2;
            if (res.statusCode == 200 && !err) {
                JSON1 = JSON.parse(body)[0];
                request(target_URL2, function (err, res, body) {
                    if (res.statusCode == 200 && !err) {
                        JSON2 = JSON.parse(body)[0];
                    }
                    else {
                        console.log('invalid c2 name');
                        resolve(undefined_code);
                    }

                    if (subtype != undefined_code) {
                        if (JSON2.hasOwnProperty(subtype) && JSON1.hasOwnProperty(subtype)) {
                            console.log([JSON1[subtype], JSON2[subtype]]);
                            resolve([JSON1[subtype], JSON2[subtype], 0]);
                        }
                        else {
                            console.log('undefined subtype');
                            resolve(undefined_code);
                        }
                    }
                    else {
                        console.log([JSON1['price_usd'], JSON2['price_usd']]);
                        resolve([JSON1['price_usd'], JSON2['price_usd'], 1]);
                    }
                });
            }
            else {
                console.log('invalid c1 name');
                resolve(undefined_code);
            }
        });
    });
}

compare_bitcoins('bitcoin', 'ethereum', 'price');

//not implemented yet
function rank () {
    return true;
}

module.exports.search_bitcoin = search_bitcoin;
module.exports.compare_bitcoins = compare_bitcoins;
module.exports.undefined_code = undefined_code;

//turns a user command to a segment of the URL that is to be called
function Command_to_URL(cmd) {
    if (cmd == 'price') return 'price_usd';
    else if (cmd == 'symbol') return 'symbol';
    else if (cmd == '24hvolume') return '24h_volume_usd';
    else if (cmd == 'marketcap') return 'market_cap_usd';
    else if (cmd == 'total_supply') return 'total_supply';
    else if (cmd == 'available_supply') return 'available_supply';
    else if (cmd == '1h') return 'percent_change_1h';
    else if (cmd == '1d') return 'percent_change_24h';
    else if (cmd == '7d') return 'percent_change_7d ';
    else return undefined_code;
}



