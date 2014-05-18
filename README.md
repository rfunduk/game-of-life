# Game of Life

An odd little [Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life)
implementation that uses a Ruby+Rack backend to do step generations, but where
the results are fed to a JavaScript front-end for drawing via canvas.

Done in about 3 hours.

## Usage

Clone the repo.

    bundle install
    bundle exec rspec
    bundle exec thin start
