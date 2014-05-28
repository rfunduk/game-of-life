require 'cell'

class Grid
  class InvalidEncodingError < StandardError; end

  attr_accessor :width, :height
  attr_reader :cells

  def initialize( width: 100, height: 100, toroidal: false )
    @toroidal = toroidal
    @width = width
    @height = height
    @cells = (0...height).map { (0...width).map { Cell.new } }
  end

  def step!
    @cells = generate_next_step!
  end

  def encode
    @cells.map { |row| row.map { |cell| cell.state }.join('') }.join("\n")
  end
  def decode( string )
    rows = string.split("\n")
    raise InvalidEncodingError.new("too many rows") if rows.length > height
    rows.each_with_index do |row, y|
      raise InvalidEncodingError.new("too many columns in row #{y}") if row.length > width
      row.split('').each_with_index do |state, x|
        cell_at(x, y).live! if state.to_i == Cell::ALIVE
      end
    end
  end

  private

  def generate_next_step!
    new_cells = deep_copy
    @cells.each_with_index do |row, y|
      row.each_with_index do |cell, x|
        neighbors = (y-1..y+1).map do |yn|
          (x-1..x+1).map do |xn|
            # skip the cell trying to decide (x,y)
            next if xn == x && yn == y

            # adjust for toroidal grid if applicable
            if @toroidal
              xn %= width
              yn %= height
            else
              next if xn >= width || xn < 0
              next if yn >= height || yn < 0
            end

            cell_at(xn, yn)
          end
        end.flatten.compact

        live_count = neighbors.select(&:alive?).count
        cell_at(x, y, new_cells).adjust_for_neighbors live_count
      end
    end
    new_cells
  end

  def deep_copy
    @cells.map { |row| row.map { |cell| cell.dup } }
  end

  def cell_at( x, y, cells=@cells )
    cells[y][x]
  end

end
