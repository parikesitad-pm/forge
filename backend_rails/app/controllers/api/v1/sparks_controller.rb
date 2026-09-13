module Api
  module V1
    class SparksController < BaseController
      # POST /api/v1/observations/:id/spark
      def pin
        observation = find_user_observation(params[:id])
        observation.update!(pinned: true)

        render_success(observation_payload(observation), "Kept as Spark. ✦")
      end

      # DELETE /api/v1/observations/:id/spark
      def unpin
        observation = find_user_observation(params[:id])
        observation.update!(pinned: false)

        render_success(observation_payload(observation), "Spark released.")
      end

      # GET /api/v1/fragments/:fragment_id/sparks
      def index
        fragment = current_user.fragments.find(params[:fragment_id])
        sparks = fragment.observations.where(pinned: true).order(created_at: :desc)

        render_success(sparks.map { |s| observation_payload(s) })
      end

      private

      def find_user_observation(id)
        Observation.joins(:fragment)
                   .where(fragments: { user_id: current_user.id }, observations: { id: id })
                   .first!
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
