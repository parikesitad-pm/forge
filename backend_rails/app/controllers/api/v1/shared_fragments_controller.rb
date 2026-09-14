module Api
  module V1
    class SharedFragmentsController < BaseController
      skip_before_action :require_login

      # GET /api/v1/share/:username/:share_slug
      # Public read-only window into one explicitly shared fragment
      def show
        clean_username = params[:username].to_s.sub(/\A@/, "")
        user = User.find_by(username: clean_username)

        unless user
          return render_error("Author not found.", :not_found)
        end

        fragment = user.fragments.active.find_by(share_slug: params[:share_slug])

        unless fragment&.shared?
          return render_error("This shared fragment is not available, private, or has been revoked.", :not_found)
        end

        ordered_obs = fragment.observations.order(created_at: :asc)
        sparks = ordered_obs.select(&:pinned?)

        payload = {
          title: fragment.title,
          display_title: fragment.display_title,
          seed: fragment.content,
          shared_at: fragment.shared_at,
          created_at: fragment.created_at,
          author: {
            username: user.username,
            calling_name: user.display_calling_name
          },
          entries: ordered_obs.map do |obs|
            {
              id: obs.id,
              role: obs.role,
              content: obs.content,
              pinned: obs.pinned? || false,
              created_at: obs.created_at
            }
          end,
          sparks: sparks.map do |s|
            {
              id: s.id,
              content: s.content,
              created_at: s.created_at
            }
          end
        }

        render_success(payload)
      end
    end
  end
end
