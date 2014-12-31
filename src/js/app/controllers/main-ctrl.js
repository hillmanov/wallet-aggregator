controllers.controller('MainCtrl', function(orders) {
  var self = this;

  orders.getOrderBreakdown($('.orders'))
    .then(function(orderBreakdown) {
      console.log(orderBreakdown);
      self.orderBreakdown = orderBreakdown;
    })
    .catch(function(err) {
      err;
    });

});

