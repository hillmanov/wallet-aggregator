controllers.controller('MainCtrl', function(orders) {
  var self = this;

  this.notifications = {
    pageCount: 0,
    orderCount: 0
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

