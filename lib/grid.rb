require 'cell'

class Grid
  class InvalidEncodingError < StandardError; end

  attr_accessor :width, :height
  attr_reader :cells

  def initialize( width: 100, height: 100 )
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
        # generate a search grid, starting at one cell up-let
        # and going to one cell down-right
        start_x, end_x = [x-1, 0].max, [x+1, width-1].min
        start_y, end_y = [y-1, 0].max, [y+1, height-1].min

        neighbors = (start_y..end_y).map do |yn|
          (start_x..end_x).map do |xn|
            # skip the cell deciding if it lives or dies
            # so that it doesn't count itself as a neighbor
            cell_at(xn, yn) unless xn == x && yn == y
          end
        end
        live_count = neighbors.flatten.compact.select(&:alive?).count

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
