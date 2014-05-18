require 'rspec/autorun'

$: << File.expand_path('../lib', __FILE__)

if RUBY_VERSION.split('.').map(&:to_i).first < 2
  puts "Ruby 2.0+ is required to run this project."
  exit 1
end

require 'cell'
require 'grid'

RSpec.configure do |config|
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end

Dir.glob('./*_spec.rb').each { |f| require f }
