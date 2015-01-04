controllers.controller('MainCtrl', function(orders) {
  var self       = this,
      googlesCut = 0.30;

  this.notifications = {
    pageCount: 0,
    orderCount: 0
  };

  this.multiplier      = (1.0 - googlesCut);
  this.applyGooglesCut = true;

  this.toggleApplyGooglesCut = function() {
    this.multiplier = (this.multiplier === 1) ? (1.0 - googlesCut) : 1.0;
  };

  orders.getOrderBreakdown($('.orders'))
    .then(
      function success(orderBreakdown) {
        self.orderBreakdown = orderBreakdown;
      },
      function error(err) {
        console.log(err);
      },
      function notify(notification) {
        self.notifications[notification.type] = notification.value;
      }
    );

});

