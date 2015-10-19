(function($) {
  Drupal.behaviors.stormPathHome = {
    /**
     * Set equal heights on key elements to preserve layout.
     */
    attach: function (context, settings) {
      // Only apply equal heights on devices wider than 480px.
      if ($(window).width() > 480) {
        // Leader tabs.
        $('.sp-tabs ul a').equalHeights();
        // Steps.
        $('#block-boxes-home-steps h4').equalHeights();
        // Footer blocks.
        $('#footer #block-boxes-footer-left, #footer .block-system, #footer .block-menu').equalHeights();
      }
    }
  }
})(jQuery);
