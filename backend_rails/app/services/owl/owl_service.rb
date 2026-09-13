module Owl
  class OwlService
    def initialize(fragment:, message: nil)
      @fragment = fragment
      @message = message
    end

    def observe
      GeminiAdapter.new(fragment: @fragment, message: @message).call
    end

    def synthesize_growth
      GrowthSynthesizer.new(fragment: @fragment).call
    end
  end
end
