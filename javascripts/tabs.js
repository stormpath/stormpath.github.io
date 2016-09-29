(function($) {
  Drupal.behaviors.stormPathTabs = {
    /**
     * Attache jQuery UI tab behavior to content with the sp-tabs class.
     */
    attach: function (context, settings) {
      $('.sp-tabs', context).tabs({heightStyle: 'fill'});

      // Fix height of tabs since this version of jquery UI doesn't support the heightStyle option.
      $('.ui-tabs-panel').equalHeights();
    }
  }
})(jQuery);
