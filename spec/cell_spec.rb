require 'spec_helper'

describe Cell do
  subject { Cell.new }

  it { should be_a Cell }
  it { should be_dead }

  describe '#live!' do
    before { subject.live! }
    it { should be_alive }
  end

  describe '#toggle!' do
    it 'should toggle on' do
      subject.toggle!
      expect(subject).to be_alive
    end
    it 'should toggle off' do
      subject.toggle!
      subject.toggle!
      expect(subject).to be_dead
    end
  end
end
