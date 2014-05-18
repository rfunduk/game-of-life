require 'spec_helper'

describe Grid do
  describe 'size' do
    describe 'defaults' do
      subject { Grid.new }
      its(:width) { should be_a Fixnum }
      its(:height) { should be_a Fixnum }
    end

    describe 'custom' do
      subject { Grid.new( width: 200, height: 200 ) }
      its(:width) { should eq 200 }
      its(:height) { should eq 200 }
    end
  end

  describe '#cells' do
    subject { Grid.new( width: 2, height: 2 ) }

    it 'should expose cells' do
      expect(subject.cells).to have(2).elements
      expect(subject.cells.first).to have(2).elements
      expect(subject.cells.first.first).to be_a Cell
    end
  end

  describe '#encode' do
    subject { Grid.new( width: 3, height: 3 ) }
    its(:encode) { should eq "000\n000\n000" }
  end

  describe '#decode' do
    context 'valid' do
      subject { Grid.new( width: 5, height: 5 ) }
      it 'should decode cells' do
        encoded = "11111\n00000\n11111\n00000\n11111"
        expect { subject.decode(encoded) }.not_to raise_error
        subject.decode( encoded )
        expect(subject.encode).to eq encoded
      end
    end
    context 'invalid' do
      subject { Grid.new( width: 1, height: 1 ) }
      it 'should fail gracefully' do
        encoded = "111\n000\n111"
        expect { subject.decode(encoded) }.to raise_error Grid::InvalidEncodingError
      end
    end
  end

  describe '#step' do
    subject { Grid.new( width: 3, height: 3 ) }
    before { subject.decode( "010\n010\n010" ) }

    it 'should apply cell rules' do
      subject.step!
      cells = subject.encode
      expect(cells).to eq "000\n111\n000"
    end
  end
end
