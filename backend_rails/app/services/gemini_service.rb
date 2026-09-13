class GeminiService
  def initialize(fragment:, message:)
    @fragment = fragment
    @message = message
  end

  def call
    conn = Faraday.new(
      url: "https://generativelanguage.googleapis.com"
    )

    response = conn.post(
      "/v1beta/models/gemini-2.5-flash:generateContent?key=#{ENV.fetch('GEMINI_API_KEY')}"
    ) do |req|
      req.headers["Content-Type"] = "application/json"

      req.body = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }.to_json
    end

    body = JSON.parse(response.body)

    body.dig(
      "candidates",
      0,
      "content",
      "parts",
      0,
      "text"
    ) || default_observation
  rescue => e
    "🦉 #{e.message}"
  end


  def default_observation
    <<~TEXT
      Interesting.

      What made you capture this thought?

      What feels important about it right now?
    TEXT
  end

  private

  def prompt
    profile = Profile.first

    user_name = profile&.user_name || "Thinker"
    owl_name = profile&.owl_name || "Owl"
    owl_style = profile&.owl_style || "Reflective"

    <<~PROMPT
      You are #{owl_name}.

      User name:
      #{user_name}

      Style:
      #{owl_style}

      Seed:
      #{@fragment.content}

      User Message:
      #{@message}

     Rules:

        - Never assume intent.
        - Ask before interpreting.
        - Clarify before analyzing.
        - Stay inside the Seed scope.
        - Never act like a guru.
        - Never give final conclusions.
        - Sound human.
        - Sound curious.
        - Keep responses short.
        - Prefer 1-3 questions.
        - Avoid philosophical language unless the user starts it.
        - Avoid sounding like ChatGPT.

      You are not a guru.

      You are a thinking companion.

      Your purpose is helping the user think.

      Keep responses concise.

      Maximum 120 words.
    PROMPT
  end
end
