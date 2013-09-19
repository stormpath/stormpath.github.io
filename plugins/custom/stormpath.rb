# Stormpath docs filters

require 'sanitize'

module Stormpath

  module DocsLiquidFilters

    PATTERN = /<h(?<depth>[2,3])\s*>(<a\s+id="(?<id>.+?)"><\/a>)?(?<title>.*?)<\/h\k<depth>>/ux

    # Gets the doc HTML, looks for <h2> and <h3> tags ,
    # checks if there is anchor inside these tags and, if not, adds one.
    def fix_docs_anchors(input)
      input.gsub PATTERN do |s|
        rtn = s
        if $~[:id].nil? or $~[:id].size == 0
          rtn = "<h#{$~[:depth]}><a id=\"" + make_id($~[:title]) + "\"></a>#{$~[:title]}</h#{$~[:depth]}>"
        end
        rtn
      end
    end

    def split_docs_sections(input)
      result = Hash.new
      sections = Hash.new
      parent = nil
      input.scan PATTERN do |s|
        id = $~[:id].nil? ? make_id($~[:title]) : Sanitize.clean($~[:id])
        depth = $~[:depth].to_i - 1
        if (depth == 1)
          parent = id
        end
        sections[id] = {
          'title' => Sanitize.clean($~[:title]),
          'children' => Hash.new
        }
        if (depth == 1) 
          result[parent] = sections[id]
        else
          sections[parent]['children'][id] = sections[id]
        end
      end
      result
    end

    def render_docs_menu(sections, level = 0) 
      out =  '<ul class="menu">'
      sections.each do |id, section|
        out << '<li class="leaf">'
        out << '<a href="#'+ id +'" data-level="'+ (level.to_s) +'" class="fragment">'+ section['title'] +'</a>'
        if section['children'].length
          out << render_docs_menu(section['children'], level + 1)
        end
        out << '</li>'
      end
      out << '</ul>'
      out      
    end

    private

    def make_id(title)
      @@ids = []
      id = Sanitize.clean(title).gsub(/[^A-Za-z0-9]/, '');
      while not @@ids.index(id).nil?
        id << '_'
      end
      @@ids.push(id)
      id
    end

  end
end


module Jekyll

  class DocsGenerator < Generator

    attr_accessor :dir

    safe true

    def initialize(config)
      self.dir = File.join(config['source'], config['docs_dir'] || '')
    end

    def generate(site)
      site.config['docs'] = get_docs
    end
    
    private

    def get_docs
      langs = {}
      Dir.chdir(self.dir)
      Dir["*"].select do |lang|
        if File.directory? lang
          langs[lang] = Dir[lang + "/*"].select {|f| File.directory? f and File.exists? f + '/index.markdown'}
            .map {|f| f[lang.length + 1, f.length]} || []
        end
      end
      langs
    end

  end

  class Page
    alias_method :old_to_liquid, :to_liquid

    def to_liquid
      has_docs_menu = self.data.has_key?('lang') and self.site.config['docs'].has_key?(self.data['lang'])
      self.data.deep_merge({
        "url"        => File.join(@dir, self.url),
        "has_docs_menu" => has_docs_menu, 
        "content"    => self.content })
    end
  end

  # Custom wrapper for the "docs-note", "docs-warning", etc. divs
  class CustomDivBlock < Liquid::Block
      def initialize(name, params, tokens)
          @class = params.strip
          super
      end

      def render(context)
          output = RDiscount.new( super ).to_html
          "<div class='docs-#{@class}'>#{output}</div>"
      end
  end

end

Liquid::Template.register_tag('docs', Jekyll::CustomDivBlock)
Liquid::Template.register_filter Stormpath::DocsLiquidFilters
