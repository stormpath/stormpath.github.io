(function ($) {
  var current_page = '';
  var languages = [];  
  
  $(document).ready(function(e) {
      // Initialize global variables.
      languages = typeof sp_docs_menu !== 'undefined' ? sp_docs_menu : {};
      current_page = window.location.pathname.split('/').slice(2);
      current_page = current_page.length ? current_page[0] : undefined;
      var $form = $('form.stormpath-docs-select-lang');
      if ($form.length) {
        $form.find('select[name="language"]').change(function(e) {
          var lang = $('> option:selected', this).val();
          if (lang && lang in languages) {
            do_redirect(lang);
          }
        });
        $form.find('input[type="submit"]').click(function(e) {
          var lang = $(this).parents('form').find('select[name="language"] option:selected').val();
          if (lang && lang in languages) {
            do_redirect(lang);
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
      }
      // Make language select "fancy".
      $('select.stormpath-fancy-select:not(.processed)').each(function() {
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
      // Hide all 3+ level menues. Active menu branch will be shown later on window.load
      $('.block-stormpath-docs .menu .menu .menu').hide();
      // For the front page.
      var max_height = 0;
      $('body.page-docs .center-wrapper .pane-block').each(function() {
        max_height = Math.max(max_height, $(this).height());
      });
      $('body.page-docs .center-wrapper .pane-block').css('height', max_height);      
  });

  /**
   * Redirect browser to another language.
   */
  function do_redirect(lang) {
    if (current_page !== undefined && languages[lang].indexOf(current_page) >= 0) {
      window.location.pathname = lang +'/'+ current_page;
    }
    else if (current_page !== undefined && languages[lang].indexOf('quickstart') >= 0) {
      window.location.pathname = lang +'/quickstart';
    }
    else if (current_page !== undefined) {
      window.location.pathname = lang +'/'+ languages[lang][0];
    } else {
      window.location.pathname = lang +'/quickstart';
    }
  }

  /**
   *
   */
  strormpath_docs_menu_map = function($_anchors) {
    $anchors = $_anchors.filter(function() {
      // Fill menu map.
      var id = this.hash.substring(1);
      return (document.getElementById(id) != null);
    });
    
    var _this = this;
    this.current = null;
    this.current_branch = null;
    this.branches = [];
    $anchors.each(function() {
      // Fill menu map.
      var id = this.hash.substring(1);
      var element = document.getElementById(id);
      var item = {
        id: id,
        anchor: this,
        element: element,
        level: parseInt($(this).attr('data-level')) || 0,
        start: element.offsetTop,
      };
      if (item.level > 0) {
        item.parent = $(this).parents('ul.menu:first').parent('li').find('a.fragment:first');
      }
      else {
        var branch = $(this).next('ul.menu');
        // Set unique id to easily identify branch.
        branch.data('uuid', Math.random());
        _this.branches.push(branch);
      }
      _this.push(item);
      // Set 'end' for previous item.
      if (_this.length > 1) {
        _this[_this.length - 2].end = _this[_this.length - 1].start;
      } 
    });
    if (_this.length > 0) {
      _this[_this.length - 1].end = Infinity;
    }
  };
  
  strormpath_docs_menu_map.prototype = new Array();

  /**
   * Find element by id.
   */
  strormpath_docs_menu_map.prototype.findById = function(id) {
    for (var key in this) {
      if (this.hasOwnProperty(key) && (parseInt(key) == key) && this[key].id === id) {
        return this[key];
      }
    }
    return undefined;
  }

  /**
   * Push old status to the history.
   */
  strormpath_docs_menu_map.prototype.pushHistoryState = function(path) {
    if (typeof window.history.pushState === 'function') {
      history.pushState({}, '', path);
    }
  }

  /**
   * Set new current item in the docs menu.
   */
  strormpath_docs_menu_map.prototype.setCurrent = function(current) {
    var prev_item = this.current;
    if (this.current !== null) {
      $(this.current).removeClass('current');
    }
    this.current = current;
    $(this.current).addClass('current');
    var current_item = this.findById(this.current.hash.substr(1));
    if (typeof current_item === 'undefined') {
      // Reset current path.
      return;
    }
    if (current_item.level === 0) {
      var new_branch = $(this.current).next('ul.menu');
    }
    else {
      var new_branch = $(current_item.parent).next('ul.menu');
    }
    if (this.current_branch === null) {
      this.current_branch = new_branch;
    }
    else if (new_branch.data('uuid') !== this.current_branch.data('uuid')) {
      $(this.current_branch).hide();
      this.current_branch = new_branch;
    }
    $(this.current_branch).show();
    $(this.current_branch).height(); // Do not remove.
  }

  /**
   * Get currently selected branch.
   */
  strormpath_docs_menu_map.prototype.getCurrentBranch = function() {
    return this.current_branch === null ? undefined : this.current_branch;
  }
  
  $(window).load(function() {
    // Offset from the top of the content area to the header of current section.
    // This will help us to know when to switch active menu item when user scrolls the page.
    var MAGIC_OFFSET = $('#header-wrapper').height() + 20;
    var $anchors = $('.block-stormpath-docs .menu a.fragment');
    if (!$anchors.length) {
      return;
    }
    var content_area = window;
    var menu_map = new strormpath_docs_menu_map($anchors);
    $anchors.each(function() {
      // Mark active menu item.
      if (window.location.hash === this.hash || window.location.hash == '#!'+ this.hash.substr(1)) {
        menu_map.setCurrent(this);
        var id = this.hash.substr(1);
        var el = document.getElementById(id);
        $(content_area).scrollTop(Math.max(0, el.offsetTop));
        return false; // break;
      }
    });
    $anchors.click(function(e) {
      // Scroll content area manually.
      var id = this.hash.substr(1);
      var el = document.getElementById(id);
      $(content_area).scrollTop(Math.max(0, el.offsetTop - MAGIC_OFFSET));
      menu_map.pushHistoryState('#'+ this.hash.substr(1));
      e.preventDefault();
      return false;
    });
    var current_root = $('.block-stormpath-docs .menu .leaf.active-trail > a').get(0);
    $(current_root).removeClass('active');
    if (menu_map.current === null) {
      menu_map.setCurrent(current_root);
    }
    $(content_area).scroll(function(e) {
      var top = $(content_area).scrollTop() + MAGIC_OFFSET + 2;
      var new_item_found = false;
      // Find menu map item user currently view.
      for (var key in menu_map) {
        if (!menu_map.hasOwnProperty(key) || (parseInt(key) != key)) {
          continue;
        }
        if (top >= menu_map[key].element.offsetTop && top < menu_map[key].end) {
          menu_map.setCurrent(menu_map[key].anchor);
          new_item_found = true;
          break;
        }
      }
      if (!menu_map.current && !new_item_found) {
        menu_map.setCurrent(current_root);
      }
    });
    // Trigger scroll event to set actual current item.
    // User could already had scrolled content area until window.load triggered.
    $(content_area).trigger('scroll');
  });

  // Fancy select functions.

  function fancySelect(select) {
    var _this = this;
    var $select = $(select);
    var $fancy = $('<span class="stormpath-fancy-select"></span>');
    this._$select = $select;
    this.$select = $fancy;
    this.options = [];
    this.value = null;
    $fancy.attr('tabindex', $select.attr('tabindex') || 0);
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
        $(this).prop('selected', true);
      }
      else {
        $(this).removeProp('selected');
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
          _this.selectOption(_this.options[_this.value - 1], _this.value - 1);
        }
        e.preventDefault();
        break;
      case 40: // Down arrow.
      case 63233: // Safari down arrow.
        if (_this.value + 1 < _this.options.length) {
          _this.selectOption(_this.options[_this.value + 1], _this.value + 1);
        } 
        e.preventDefault();
        break;
      case 13:  // enter
        _this.$select.trigger('blur');
        break
    }
  }
  
})(jQuery);
