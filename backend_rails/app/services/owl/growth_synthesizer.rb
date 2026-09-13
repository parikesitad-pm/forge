module Owl
  class GrowthSynthesizer
    def initialize(fragment:)
      @fragment = fragment
    end

    def call
      sparks = @fragment.observations.where(pinned: true).order(created_at: :asc)
      entries = @fragment.observations.order(created_at: :asc)

      return default_early_growth if sparks.empty? && entries.count < 3

      api_key = ENV["GEMINI_API_KEY"].presence || ENV["GOOGLE_API_KEY"].presence
      if api_key.present?
        synthesize_with_ai(sparks, entries)
      else
        synthesize_fallback(sparks, entries)
      end
    end

    private

    def default_early_growth
      {
        status: "seedling",
        headline: "A thought in its early soil",
        reflection: "This fragment is still gathering its initial shape. As you explore more angles and mark observations that matter with Sparks, possible patterns and creative tensions will gradually emerge here.",
        sparks_count: 0,
        tensions: [
          "The thought is held without rush to closure."
        ],
        invitation: "What is another honest angle or counterpoint you've been hesitant to write down?"
      }
    end

    def synthesize_fallback(sparks, _entries)
      sparks_snippets = sparks.map(&:content).join(" ")
      {
        status: "taking_shape",
        headline: "Something may be taking shape",
        reflection: "You have anchored this seed with #{@fragment.observations.where(pinned: true).count} Sparks. There appears to be a gentle tension between holding multiple possibilities open and finding the ground where your commitment feels natural.",
        sparks_count: sparks.count,
        tensions: [
          "Possibility vs. commitment",
          "What is observed vs. what is decided"
        ],
        invitation: "Does this emerging connection feel aligned with what you are trying to understand?"
      }
    end

    def synthesize_with_ai(sparks, entries)
      sparks_text = sparks.map { |s| "- #{s.content}" }.join("\n")
      entries_text = entries.last(8).map { |e| "- (#{e.role}): #{e.content}" }.join("\n")

      prompt = <<~PROMPT
        You are Owl, synthesizing Growth for a thinker in Forge.
        Growth is NOT a rigid summary or a life prescription.
        Growth surfaces subtle relationships, tensions, recurring motifs, and emerging ideas while ALWAYS preserving uncertainty.

        Seed:
        "#{@fragment.content}"

        Sparks (observations the thinker explicitly chose as meaningful):
        #{sparks_text.presence || "No sparks pinned yet."}

        Recent Thought Evolution:
        #{entries_text}

        Format your response as valid JSON with the following exact keys:
        {
          "status": "taking_shape",
          "headline": "A short poetic headline (e.g. 'Something may be taking shape' or 'Between stillness and decision')",
          "reflection": "A 2-3 paragraph contemplative reflection noticing patterns and tensions. Use phrases like 'There may be a tension between...', 'You seem to return to...', 'Perhaps...'. Never declare definitive truth.",
          "tensions": ["A short phrase describing tension 1", "A short phrase describing tension 2"],
          "invitation": "A gentle concluding question inviting the user to decide what this means."
        }
        Return ONLY valid JSON.
      PROMPT

      adapter = GeminiAdapter.new(fragment: @fragment, custom_prompt: prompt)
      raw = adapter.call

      parsed = JSON.parse(raw.gsub(/```json|```/, "").strip) rescue nil
      if parsed.is_a?(Hash) && parsed["reflection"].present?
        parsed.merge("sparks_count" => sparks.count)
      else
        synthesize_fallback(sparks, entries)
      end
    end
  end
end
