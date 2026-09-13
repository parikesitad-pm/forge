module Owl
  class GeminiAdapter
    API_URL = "https://generativelanguage.googleapis.com".freeze
    MODEL = "gemini-2.5-flash".freeze

    def initialize(fragment:, message: nil, custom_prompt: nil)
      @fragment = fragment
      @message = message || fragment.content
      @custom_prompt = custom_prompt
    end

    def call
      api_key = ENV["GEMINI_API_KEY"].presence || ENV["GOOGLE_API_KEY"].presence
      return fallback_observation unless api_key.present?

      conn = Faraday.new(url: API_URL) do |f|
        f.request :json
        f.response :json, content_type: /\bjson$/
        f.options.timeout = 10
        f.options.open_timeout = 5
      end

      response = conn.post("/v1beta/models/#{MODEL}:generateContent?key=#{api_key}") do |req|
        req.headers["Content-Type"] = "application/json"
        req.body = {
          contents: [
            {
              parts: [
                { text: @custom_prompt || observation_prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250
          }
        }
      end

      if response.success? && response.body.is_a?(Hash)
        text = response.body.dig("candidates", 0, "content", "parts", 0, "text")
        text.presence || fallback_observation
      else
        fallback_observation
      end
    rescue StandardError => e
      Rails.logger.warn("[Owl::GeminiAdapter] AI call failed: #{e.message}")
      fallback_observation
    end

    def fallback_observation
      options = [
        "Interesting. What made you capture this thought right now? What feels most alive or unresolved about it?",
        "One pattern I notice here is the contrast between what is felt and what is expressed. Does that distinction resonate with where your attention goes?",
        "There may be something quietly opening up here. What changes if you don't try to solve this right away, but simply stay with it?",
        "You seem to be circling around a question that hasn't fully named itself yet. What would be the honest next question to ask yourself?"
      ]
      options[rand(options.length)]
    end

    private

    def observation_prompt
      user_name = @fragment.user&.username || "Thinker"
      recent_thoughts = @fragment.observations.order(created_at: :asc).last(6).map do |obs|
        role = obs.role == "ai" ? "Owl (Observer)" : "#{user_name} (Thinker)"
        "#{role}: #{obs.content}"
      end.join("\n\n")

      <<~PROMPT
        You are Owl, a quiet, curious, and reflective thinking companion inside Forge.

        Core Philosophy:
        "Capture first. Understand later."
        "Owl observes. The thinker decides."
        "Forge doesn't think for you. It helps you think."

        Seed (The anchor of this thought):
        "#{@fragment.content}"

        Recent Thinking History:
        #{recent_thoughts.presence || "No previous entries yet."}

        Latest User Thought:
        "#{@message}"

        Your Guidelines:
        - You are NOT a generic AI assistant, ChatGPT, or an oracle.
        - Never provide prescriptive answers, life solutions, or definitive conclusions.
        - Notice subtle tensions, recurring motifs, unexamined assumptions, or possible connections.
        - Prefer framing your thought with humility:
          - "There may be a connection between..."
          - "One pattern I notice is..."
          - "You seem to return to..."
          - "Another way to look at this might be..."
          - "What changes if..."
          - "Does that feel accurate to you?"
        - Keep responses concise, warm, editorial, and contemplative (under 90 words).
        - Invite the thinker to continue exploring their own thought.
      PROMPT
    end
  end
end
