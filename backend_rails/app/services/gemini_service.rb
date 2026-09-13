class GeminiService
  def initialize(fragment:, message:)
    @fragment = fragment
    @message = message
  end

  def call
    Owl::GeminiAdapter.new(fragment: @fragment, message: @message).call
  end
end
