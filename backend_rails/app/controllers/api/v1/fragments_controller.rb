module Api
  module V1
    class FragmentsController < BaseController
      def index
        fragments = current_user.fragments
                                .includes(:observations)
                                .order(created_at: :desc)

        data = fragments.map do |f|
          fragment_summary(f)
        end

        render_success(data)
      end

      def show
        fragment = current_user.fragments.find(params[:id])
        render_success(fragment_detail(fragment))
      end

      def create
        content = params.require(:fragment).permit(:content)[:content]

        fragment = current_user.fragments.build(content: content)

        if fragment.save
          # The first content is the Seed. Owl quietly observes the initial seed.
          observation_text = Owl::OwlService.new(fragment: fragment).observe
          observation = fragment.observations.create!(
            role: :ai,
            content: observation_text
          )

          render_success(
            fragment_detail(fragment),
            "Seed captured. Owl is observing.",
            :created
          )
        else
          render_error(fragment.errors.full_messages.to_sentence)
        end
      end

      def destroy
        fragment = current_user.fragments.find(params[:id])
        fragment.destroy
        render_success({ id: fragment.id }, "Fragment released.")
      end

      private

      def fragment_summary(fragment)
        observations = fragment.observations
        {
          id: fragment.id,
          seed: fragment.content,
          observations_count: observations.size,
          sparks_count: observations.count { |o| o.pinned? },
          created_at: fragment.created_at,
          updated_at: fragment.updated_at
        }
      end

      def fragment_detail(fragment)
        ordered_obs = fragment.observations.order(created_at: :asc)
        sparks = ordered_obs.select { |o| o.pinned? }

        {
          id: fragment.id,
          seed: fragment.content,
          created_at: fragment.created_at,
          updated_at: fragment.updated_at,
          entries: ordered_obs.map { |o| observation_payload(o) },
          sparks: sparks.map { |s| observation_payload(s) }
        }
      end

      def observation_payload(obs)
        {
          id: obs.id,
          fragment_id: obs.fragment_id,
          role: obs.role, # "user" or "ai"
          content: obs.content,
          pinned: obs.pinned? || false,
          created_at: obs.created_at
        }
      end
    end
  end
end
