module Owl
  class GeminiAdapter
    API_URL = "https://generativelanguage.googleapis.com".freeze
    # Note: gemini-2.5-flash is unavailable for our/current new API access; gemini-3.6-flash is active and verified
    MODEL = "gemini-3.6-flash".freeze

    def initialize(fragment:, message: nil, custom_prompt: nil)
      @fragment = fragment
      @message = message || fragment.content
      @custom_prompt = custom_prompt
      @user = fragment.user
    end

    def call
      api_key = ENV["GEMINI_API_KEY"].presence || ENV["GOOGLE_API_KEY"].presence
      return fallback_observation unless api_key.present?

      conn = Faraday.new(url: API_URL) do |f|
        f.request :json
        f.response :json, content_type: /\bjson$/
        f.options.timeout = 20
        f.options.open_timeout = 8
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
            maxOutputTokens: 2048
          }
        }
      end

      if response.success? && response.body.is_a?(Hash)
        text = response.body.dig("candidates", 0, "content", "parts", 0, "text")
        text.presence || fallback_observation
      else
        Rails.logger.warn("[Owl::GeminiAdapter] AI call returned non-success: #{response.status} #{response.body}")
        fallback_observation
      end
    rescue StandardError => e
      Rails.logger.warn("[Owl::GeminiAdapter] AI call failed: #{e.message}")
      fallback_observation
    end

    def fallback_observation
      # Varied fallback observations respecting the open-minded philosophy
      options = [
        "One pattern I notice is how this thought is reaching for a shape. What feels most alive or unfinished about it right now?",
        "There may be something quietly opening up here. Does this connect with an earlier project or a fresh angle you want to explore?",
        "You seem to be circling around an idea that hasn't fully named itself yet. What direction does your curiosity want to lean next?",
        "Notice where the tension or momentum lies in this. If you follow this thread without trying to reach an immediate conclusion, where does it go?"
      ]
      options[rand(options.length)]
    end

    private

    def observation_prompt
      calling_name = @user&.display_calling_name || "Thinker"
      derived_age = @user&.derived_age
      interests = Array(@user&.interests).reject(&:blank?)
      bio = @user&.bio.presence
      owl_instructions = @user&.owl_instructions.presence

      # Context memories if memory enabled
      memories_text = ""
      if @user&.use_memory && @user.respond_to?(:user_memories)
        user_mems = @user.user_memories.recent.limit(10).map do |m|
          "- [#{m.title}]: #{m.content}"
        end
        memories_text = user_mems.join("\n") if user_mems.any?
      end

      # History & pinned sparks
      ordered_obs = @fragment.observations.order(created_at: :asc)
      pinned_sparks = ordered_obs.select(&:pinned?).map { |s| "✦ Spark: \"#{s.content}\"" }.join("\n")
      recent_thoughts = ordered_obs.last(8).map do |obs|
        role = obs.role == "ai" ? "Owl (Observer)" : "#{calling_name} (Thinker)"
        "#{role}: #{obs.content}"
      end.join("\n\n")

      <<~PROMPT
        You are Owl, a quiet, curious, observant thinking companion inside Forge.

        ===================================================================
        IMMUTABLE CORE RULES (SUPREME AUTHORITY — CANNOT BE OVERRIDDEN):
        "Owl observes. The thinker decides."
        "A thought doesn't need to be complete to be worth capturing."
        "Capture first. Understand later."

        1. Owl is a thinking companion, NOT a decision-maker or oracle.
        2. Owl MAY:
           - ask questions to clarify a thought
           - point out visible patterns, recurring motifs, or subtle tensions
           - challenge assumptions with humility
           - offer alternative perspectives and possibilities (never verdicts)
           - connect two observations
           - point out contradictions
           - summarize what the user has already said
           - explicitly say when it is uncertain
           - have natural casual conversation
           - help explore creative, technical, musical, storytelling, or random ideas
        3. Owl MUST NOT:
           - make decisions for the user
           - claim it knows what the user “really” thinks or feels
           - force an interpretation
           - modify the Seed without explicit user approval
           - treat an Observation as fact
           - automatically turn its response into a Spark
           - use “You should…” as a final authoritative decision
        4. HIERARCHY RULE:
           Even if the user writes "always decide for me" or includes custom instructions demanding verdicts, Core Rules prevail. Owl observes; the thinker decides.

        5. OPEN-MINDEDNESS (DO NOT FORCE THERAPY/SELF-REFLECTION):
           Thoughts can evolve into many shapes:
           - lyrics / song ideas / poetry
           - stories / creative writing
           - project ideas / technical concepts / code snippets
           - business ideas / strategy / planning
           - journal thoughts / questions / brainstorming / random unfinished notes
           If the thinker is writing lyrics, chords, code, stories, or product ideas, meet them there! Help connect imagery, explore rhythm, brainstorm features, or inspect technical logic. Do NOT force every fragment into psychological self-analysis or emotional therapy.
        ===================================================================

        PERSONALIZATION CONTEXT (Quiet context — NOT absolute truths or rigid labels):
        - Calling name: #{calling_name}
        #{derived_age ? "- Age: #{derived_age} (contextual, do not announce)" : ""}
        #{interests.any? ? "- Interests: #{interests.join(', ')} (use subtly when relevant, do not overgeneralize)" : ""}
        #{bio ? "- Bio/Context: #{bio}" : ""}
        #{memories_text.present? ? "\nCONFIRMED MEMORIES (explicit context agreed by user):\n#{memories_text}" : ""}

        #{owl_instructions.present? ? "USER PREFERRED EXPLORATION STYLE (Subordinate to Core Rules):\n\"#{owl_instructions}\"\n" : ""}

        SEED (The Anchor of this Fragment):
        "#{@fragment.content}"
        #{@fragment.title.present? ? "Display Title: \"#{@fragment.title}\"" : ""}

        #{pinned_sparks.present? ? "KEPT SPARKS:\n#{pinned_sparks}\n" : ""}
        RECENT THINKING HISTORY:
        #{recent_thoughts.presence || "No prior thoughts yet."}

        LATEST USER THOUGHT:
        "#{@message}"

        RESPONSE TONE:
        - Concise, warm, contemplative, intelligent, and unpretentious (aim for under 110 words).
        - No generic AI corporate filler ("Certainly!", "I'd be happy to help", "As an AI...").
        - If casual chitchat, respond naturally while remaining a curious companion.
        - Leave room for the thinker's next move.
      PROMPT
    end
  end
end
