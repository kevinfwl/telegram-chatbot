module.exports = {
    search: function (coin) {
      return new Promise(function(resolve, reject) {
        global._coin = coin.toLowerCase();
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(getCoinValue(body))
          } else {
            if (error != null ) {
              reject(error.statusCode);
            } else {
              reject(0);
            }
          }
        })
      })
    }
}