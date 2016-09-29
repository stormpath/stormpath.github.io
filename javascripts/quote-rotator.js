(function($) {
  Drupal.behaviors.stormPathQuoteRotator = {
    /**
     * Rotate anyting found in .quote-rotate (not dynamically, just once per page load).
     */
    attach: function (context, settings) {
      // First, hide all quotes.
      $('.quote-rotate li').hide();

      // Determine the number of quotes.
      var count = $('.quote-rotate li').length;

      if (count > 0) {
	// Select a random quote.
	var quote = Math.floor(Math.random() * count);

        // Show this element.
        $('.quote-rotate li:eq(' + quote + ')').show();
      }
    }
  }
})(jQuery);
