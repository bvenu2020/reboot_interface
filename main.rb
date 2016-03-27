#!/usr/bin/env ruby
require 'sinatra'
require 'slim'
require 'base64'

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
PIN = Base64.decode64 "MzQ4\n" #"OTI0Nw==\n"

threads = []

get '/' do
  slim :index
end

post '/reboot' do
  content_type :json
  if params[:pin] == PIN
    puts "PIN ACCEPTED"
    system "echo reboot requested #{Time.now} by #{request.ip} >> /tmp/reboot.log"
    puts "REBOOTING"
    threads << Thread.new{system("sleep 5 && sudo /sbin/shutdown -r now")}
    '{"status": "accepted"}'
  else
    '{"status": "rejected"}'
  end
end

post '/shutdown' do
  content_type :json
  if params[:pin] == PIN
    system "echo shutdown requested #{Time.now} by #{request.ip} >> /tmp/shutdown.log"
    system "shutdown -P now"
    '{"status": "accepted"}'
  else
    '{"status": "rejected"}'
  end
end

post '/ping' do
  content_type :json
  '"pong"'
end
