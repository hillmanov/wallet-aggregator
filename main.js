$(document).ready(function() {

  var orders = $('.orderRow').map(function(index, row) {
    return {
      date: $(row).find('.wallet-date-column > div').text(),
      status: $(row).find('.wallet-status-column > img').attr('title'),
      description: $(row).find('.wallet-description-column-shifted > div').text(),
      total: $(row).find('.wallet-total-column > div').text()
    }
  });

  _.orderBy(orders, 'date');

});