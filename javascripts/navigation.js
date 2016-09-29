(function($) {
  Drupal.behaviors.stormPathNavigation = {
    /**
     * Attach flexnav behavior to primary menu.
     */
    attach: function (context, settings) {
      $("#main-menu ul", context).flexNav({
        'breakpoint': 720
      });

      // Move read more links into the end of the post.
      $('.node-readmore').hide().each(function () {
        $(this).find('a').addClass('node-readmore');
        var link = $(this).html();
        var bodyField = $(this).parents('.links').siblings('.field-name-body').find('.field-items .field-item');
        if (bodyField.find('p:last-child').length) {
          bodyField.find('p:last-child').append('&nbsp;' + link);
        }
        else {
          bodyField.append(link);
        }
      });
    }
  }
})(jQuery);
