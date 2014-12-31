services.factory('db', function($q) {
  var dbService = {},
      _db;

  dbService.executeSql = function(sql, params) {
    var deferred = $q.defer();

    _db.transaction(function(transaction) {
      transaction.executeSql(
                              sql,
                              params,
                              function success(transaction, results) {
                                if (results.rows) {
                                  results = _.times(results.rows.length, function(index) { return results.rows.item(index); });
                                }
                                deferred.resolve(results);
                              },
                              function error(transaction, error) {
                                deferred.reject(error);
                              }
                            );
    });

    return deferred.promise;
  };

  function createTable(cb) {
    console.info("Creating db...");
    _db = openDatabase('walletAggregatorDb', '1.0', 'Database to store google wallet orders', 2 * 1024 * 1024);
    return $q.when(true);
  }

  function createOrdersTable(cb) {
    console.info("Creating orders table...");
    return dbService.executeSql('CREATE TABLE IF NOT EXISTS "orders" (id unique, appName, total, status, date)', []);
  }

  dbService.init = function() {
    return createTable()
             .then(function() {
               return createOrdersTable();
             });
  };

  return dbService;
});
