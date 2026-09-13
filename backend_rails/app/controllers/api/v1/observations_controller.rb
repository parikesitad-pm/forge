module Api
  module V1
    class ObservationsController < BaseController
      before_action :set_fragment

      # POST /api/v1/fragments/:fragment_id/entries
      # Adds a thinker thought entry
      def create
        content = params.require(:entry).permit(:content)[:content]

        user_thought = @fragment.observations.create!(
          role: :user,
          content: content
        )

        render_success(
          observation_payload(user_thought),
          "Thought added.",
          :created
        )
      end

      # POST /api/v1/fragments/:fragment_id/owl/observe
      # Owl observes the thought timeline and provides a reflective observation
      def observe
        last_user_thought = @fragment.observations.where(role: :user).order(created_at: :desc).first
        message = last_user_thought&.content || @fragment.content

        ai_content = Owl::OwlService.new(fragment: @fragment, message: message).observe

        ai_observation = @fragment.observations.create!(
          role: :ai,
          content: ai_content
        )

        render_success({
          state: "completed",
          observation: observation_payload(ai_observation)
        }, "Owl has observed.")
      rescue StandardError => e
        Rails.logger.error("[Owl Error] #{e.message}")
        render_error("Owl couldn't respond right now.", :service_unavailable)
      end

      private

      def set_fragment
        @fragment = current_user.fragments.find(params[:fragment_id])
      end

      def observation_payload(obs)
        {
          id: obs.id,
          fragment_id: obs.fragment_id,
          role: obs.role,
          content: obs.content,
          pinned: obs.pinned? || false,
          created_at: obs.created_at
        }
      end
    end
  end
end
