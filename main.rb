#!/usr/bin/env ruby
require 'sinatra'
require 'slim'
require 'base64'

require 'pry'

unless %{0.0.0.0 ::}.include?(ARGV[0])
  puts "Need bind IPv4 or IPv6 Bind address."
  puts "Possible Values are:"
  puts "  0.0.0.0 : IPv4"
  puts "  ::      : IPv6"
  exit 1
end

configure do
  set :server, 'thin'
  set :bind, ARGV[0]
  set :port, 4567

  set :public_folder, File.dirname(__FILE__) + '/public/assets/'
end

#FIXME loading PIN
PIN = Base64.decode64 "OTI0Nw==\n"

# Loading Slim Template
index = Slim::Template.new('index.slim')

get '/' do
  index.render
end

post '/reboot' do
  content_type :json
  if params[:pin] == PIN
    puts "PIN ACCEPTED"
    system("echo \"sudo shutdown -r 5\" > test.log")
    '{"status": "accepted"}'
  else
    '{"status": "rejected"}'
  end
end

