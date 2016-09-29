
(function ($) {
  /**
   * Display video in popup window.
   */
  Drupal.behaviors.stormPathPromoVideo = {
    attach: function (context, settings) {
      $('a.stormpath-promo-video').click(function(event) {
        TINY.box.show({
          iframe: $(this).attr('href'),
          width: 626,
          height: 410
        });
        event.preventDefault();
        return false;
      });
    }
  }
})(jQuery);
