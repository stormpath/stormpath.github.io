/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


  function fancySelect(select) {
    var _this = this;
    var $select = $(select);
    var $fancy = $('<span class="stormpath-fancy-select"></span>');
    this._$select = $select;
    this.$select = $fancy;
    this.options = [];
    this.value = null;
    $fancy.attr('tabindex', $select.attr('tabindex'));
    $('> option', $select).each(function(key) {
      var value = $(this).val();
      var text = $(this).html();
      var is_selected = $(this).attr('selected') == 'selected';
      _this.options[key] = new _this.option(value, text, is_selected);
      $fancy.append(_this.options[key].$option);
      if (is_selected) {
        _this.value = key; // use key as value since option can not have value attribute at all.
      }
      _this.options[key].$option.click({key: key}, function(e) {
        _this.selectOption(_this.options[e.data.key], e.data.key);
        _this.$select.trigger('blur');
      });
    });
    if (_this.value === null) {
      _this.value = 0;
    }
    // Like default selects do, add selected option to the top of the options list.
    this.selectOption(this.options[_this.value], _this.value);
    $fancy.focus(this.onFocus);
    $fancy.blur(this.onBlur);
    $fancy.keydown({select: this}, this.onKeydown);
    $select.hide().after($fancy);
    return $fancy;
  }
  
  fancySelect.prototype.selectOption = function(option, index) {
    for (var k in this.options) {
      if (k == index) {
        this.options[k].$option.addClass('selected');
        continue;
      }
      this.options[k].$option.removeClass('selected');
    }
    var $new_option = option.$option.clone().removeClass('selected').addClass('first');
    this.$select.find('.first').remove();
    this.$select.prepend($new_option);
    this.value = index;
    $('option', this._$select).each(function(k) {
      if (k == index) {
        $(this).attr('selected', 'selected');
      }
      else {
        $(this).removeAttr('selected');
      }
    });
  }
  
  fancySelect.prototype.option = function(value, text, is_selected) {
    this.value = value;
    this.text = text;
    this.is_selected = is_selected;
    var $option = $('<span></span>').attr('value', this.value);
    $option.text(this.text);
    if (this.is_selected) {
      $option.addClass('selected');
    }
    $option.click({option: this}, this.onClick);
    this.$option = $option;
  }
  
 
  fancySelect.prototype.option.prototype.onClick = function(e) {
    e.data.option.is_selected = true;
    e.data.option.$option.addClass('selected');
  }
  
  fancySelect.prototype.onFocus = function(e) {
    // In event context this points on the target element.
    $(this).addClass('focused');
  }
  
  fancySelect.prototype.onBlur = function(e) {
    $(this).removeClass('focused');
  }
  
  fancySelect.prototype.onKeydown = function(e) {
    var _this = e.data.select;
    switch (e.which) {
      case 38: // Up arrow.
      case 63232: // Safari up arrow.
        if (_this.value > 0) {
          console.debug(_this.options[_this.value - 1]);
          _this.selectOption(_this.options[_this.value - 1], _this.value - 1);
        }
        e.preventDefault();
        break;
      case 40: // Down arrow.
      case 63233: // Safari down arrow.
        console.debug(_this.value + 1, _this.options.length, _this.options[_this.value + 1]);
        if (_this.value + 1 < _this.options.length) {
          console.debug(_this.options[_this.value + 1]);
          _this.selectOption(_this.options[_this.value + 1], _this.value + 1);
        } 
        e.preventDefault();
        break;
      case 13:  // enter
        _this.$select.trigger('blur');
        break
    }
  }
  
  
  Drupal.behaviors.stormpath_fancy_select = {
    attach: function(context, settings) {
      $('select.stormpath-fancy-select:not(.processed)', context).each(function() {
        var $fancy_select = new fancySelect(this);
        $(this).addClass('processed');
        var $form = $(this).parents('form');
        // When lang is selected redirect user immediately.
        if ($form.hasClass('stormpath-docs-select-lang')) {
          $fancy_select.blur({form: $form}, function(e) {
            e.data.form.find('input[type="submit"]').click();
            e.stopPropagation(); // Form is submitted, stop propagation.
          });
        }
      });
    }
  }

  Drupal.behaviors.stormpath_docs_panels = {
    attach: function(context, settings) {
      var max_height = 0;
      $('body.page-docs .center-wrapper .pane-block', context).each(function() {
        max_height = Math.max(max_height, $(this).height());
      });
      $('body.page-docs .center-wrapper .pane-block', context).css('height', max_height);
    }
  }

})(jQuery, Drupal, this, this.document);
