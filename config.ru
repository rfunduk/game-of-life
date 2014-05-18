#!/usr/bin/env rackup

$: << File.expand_path('../lib', __FILE__)
require 'grid'

app = -> env do
  request = Rack::Request.new( env )
  response = Rack::Response.new
  params = request.params

  path = request.path[1..-1]
  path = 'index.html' if path == ''
  public_path = "./public/#{path}"

  if File.exists?(public_path)
    # plz ignore this gaping security hole :)
    data = File.read public_path
    response.write data

  elsif request.path == '/step'
    grid = Grid.new(
      width: params['width'].to_i,
      height: params['height'].to_i
    )
    grid.decode( params['data'] )
    grid.step!
    response.write grid.encode

  else
    response.status = 404
    response.write "<h1>404</h1>"
  end

  response.finish
end

run app
