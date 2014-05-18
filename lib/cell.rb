class Cell
  DEAD = 0
  ALIVE = 1

  attr_accessor :state

  def initialize( state=DEAD )
    @state = state
  end

  def live!
    @state = ALIVE
  end
  def die!
    @state = DEAD
  end
  def toggle!
    alive? ? die! : live!
  end

  def adjust_for_neighbors( neighbor_count )
    if alive?
      die! if neighbor_count < 2
      die! if neighbor_count > 3
    else
      live! if neighbor_count == 3
    end
  end

  def alive?; @state == ALIVE; end
  def dead?; !alive?; end

end
