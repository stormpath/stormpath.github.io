(function ($, window, document, undefined) {

  function slideshow($container) {
    var _this = this;
    this.$container = $container;
    this.sections = [];
    this.$container.find('> section').each(function() {
      _this.sections.push(new _this.section(this));
    });
    this.createTabs();
    this.createControls();
    this.setActiveSectionByIndex(0);
  }
  
  slideshow.prototype.createTabs = function() {
    this.$tabs = $('<span class="tabs"></span>');
    for (var key in this.sections) {
      var $tab = $('<span class="tab"></span>').text(this.sections[key].title);
      $tab.click({slideshow: this, tabIndex: key}, this.eTabClick);
      this.$tabs.append($tab);
    }
    this.$container.prepend(this.$tabs);
  }
  
  slideshow.prototype.createControls = function() {
    var $controls = $('<span class="slideshow-controls"></span>');
    this.$prev = $('<span class="prev"></span>').text('Back');
    this.$next = $('<span class="next"></span>').text('Next');
    this.$pager = $('<span class="pager"></span>');
    this.$prev.click({slideshow: this}, this.ePrevClick);
    this.$next.click({slideshow: this}, this.eNextClick);
    $controls.append(this.$prev).append(this.$next).append(this.$pager);
    this.$container.append($controls);
  }
  
  slideshow.prototype.eTabClick = function(e) {
    var _this = e.data.slideshow;
    var index = e.data.tabIndex;
    _this.setActiveSectionByIndex(index);
  }
  
  slideshow.prototype.ePrevClick = function(e) {
    var _this = e.data.slideshow;
    var section = _this.sections[_this.activeSection];
    var index = section.activeArticle;
    index = (index > 0) ? --index : section.articles.length - 1;
    section.setActiveArticleByIndex(index);
    _this.updateControls(false, true);
  }
  
  slideshow.prototype.eNextClick = function(e) {
    if ($(this).hasClass('disabled')) {
      return false;
    }
    var _this = e.data.slideshow;
    var section = _this.sections[_this.activeSection];
    var index = section.activeArticle;
    index = (index + 1 < section.articles.length) ? ++index : 0;
    section.setActiveArticleByIndex(index);
    _this.updateControls(false, true);
  }
  
  slideshow.prototype.ePageClick = function(e) {
    var _this = e.data.slideshow;
    var section = _this.sections[_this.activeSection];
    var index = e.data.index;
    section.setActiveArticleByIndex(index);
    _this.updateControls(false, true);
  }
  
  slideshow.prototype.section = function(element) {
    var _this = this;
    this.title = $(element).find('> h2').text();
    this.articles = [];
    this.$element = $(element);
    this.$element.find('> h2').hide();
    this.$element.hide();
    this.$element.find('> article').each(function() {
      $(this).hide();
      _this.articles.push(new _this.article(this));
    });
    this.setActiveArticleByIndex(0);
  }
  
  slideshow.prototype.section.prototype.article = function(element) {
    var _this = this;
    this.$element = $(element);
  }
  
  slideshow.prototype.setActiveSectionByIndex = function(index) {
    if (typeof this.activeSection !== 'undefined') {
      this.$tabs.find('.tab.active').removeClass('active');
      var old_section = this.sections[this.activeSection];
      old_section.$element.hide();
      old_section.articles[old_section.activeArticle].$element.hide();
      old_section.activeArticle = 0;
    }
    this.$tabs.find('.tab').eq(index).addClass('active');
    var new_section = this.sections[index];
    new_section.$element.show();
    new_section.articles[new_section.activeArticle].$element.show();
    this.activeSection = index;
    this.updateControls(true, true);
  }
  
  slideshow.prototype.section.prototype.setActiveArticleByIndex = function(index) {
    if (typeof this.activeArticle !== 'undefined') {
      var old_article = this.articles[this.activeArticle];
      old_article.$element.hide();
    }
    this.activeArticle = index;
    this.articles[this.activeArticle].$element.show();
  }
  
  slideshow.prototype.updateControls = function(sectionChanged, articleChanged) {
    var section = this.sections[this.activeSection];
    if (section.activeArticle == section.articles.length - 1) {
      this.$next.addClass('disabled');
    }
    else {
      this.$next.removeClass('disabled');
    }
    if (section.activeArticle == 0) {
      this.$prev.hide();
    }
    else {
      this.$prev.show();
    }
    if (sectionChanged) {
      this.$pager.empty();
      for (var k = 0; k < section.articles.length; k++) {
        var $page = $('<span></span>').html('&nbsp;');
        $page.click({slideshow: this, index: k}, this.ePageClick);
        this.$pager.append($page);
      }
    }
    if (articleChanged) {
      this.$pager.find('> span.active').removeClass('active');
      this.$pager.find('> span').eq(section.activeArticle).addClass('active');
    }
  }
  
  $(document).ready(function(e) {
      var $container = $(this).find('#how-it-works-tabs');
      if ($container.length) {
        new slideshow($container);
      }
  });
  
})(jQuery, this, this.document);
