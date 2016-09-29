# Title: Code Tab Block Generator
# Author: Tom Abbott
# Description: 
#
# Syntax 
#
# {% codetab id:uid langs:rest java python %}
# ------
# REST Code
# ------
# Java Code
# ------
# Python Code
# ------
# {% endcodetab %}
#
# Example:
#
# Output:
#

module Jekyll

  class CodeTab < Liquid::Block
  include TemplateWrapper
    @tag_name = nil
    @id = nil
    @langs = nil

    def initialize(tag_name, markup, tokens)
      @tag_name = tag_name
      id = /(?<=id:)\S*/i
      langs = /(?<=langs:)*(java|rest|python|node|ruby|curl|php)/i
      if markup =~ /(?<=id:)\S*/i
      	@id = $~
      end
      if markup =~ langs
      	@langs = markup.scan(langs)
      end
      super
    end

    def render(context)
    	code = super
    	blocks = code.scan(/(?<=-{6}).+?(?=-{6})/m)
    	source = "<div class=\"tabs\">"
    	source += "<ul>"
    	@langs.each { |val| source += "<li><a href=\"#tabs-#{@id}-#{val[0]}\">#{val[0]}</a></li>" }
		source += "</ul>"
		@langs.each_with_index { |val, index|
			source += "<div id=\"tabs-#{@id}-#{val[0]}\"><pre lang=\"#{val[0]}\"><code>"
			source += blocks[index]
			source += "</code> </pre> </div>"
		}
    	source +="</div>"
    	source 
    end
  end
end

Liquid::Template.register_tag('codetab', Jekyll::CodeTab)