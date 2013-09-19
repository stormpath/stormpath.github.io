require 'sass-globbing'
require File.dirname(__FILE__) + '/sass-extensions/zen-grids/lib/zen-grids.rb'
require 'compass';
require 'sassy-buttons'
require 'compass-recipes'


# Require any additional compass plugins here.
project_type = :stand_alone

# Publishing paths
http_path = "/"
http_images_path = "/images"
http_generated_images_path = "/images"
http_fonts_path = "/fonts"
css_dir = "public/stylesheets"
extensions_dir  = "sass-extensions"

# Local development paths
sass_dir = "sass"
images_dir = "source/images"
fonts_dir = "source/fonts"

line_comments = false
output_style = :compressed

