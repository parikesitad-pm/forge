module Api
  module V1
    class FragmentsController < BaseController
      before_action :set_fragment, only: [ :show, :destroy, :rename, :archive, :restore, :share, :revoke_share ]

      # GET /api/v1/fragments
      # Default: lists only active fragments (excludes archived)
      def index
        fragments = current_user.fragments
                                .active
                                .includes(:observations)
                                .order(created_at: :desc)

        data = fragments.map { |f| fragment_summary(f) }
        render_success(data)
      end

      # GET /api/v1/fragments/archived
      # Exclusively lists archived fragments
      def archived
        fragments = current_user.fragments
                                .archived
                                .includes(:observations)
                                .order(archived_at: :desc)

        data = fragments.map { |f| fragment_summary(f) }
        render_success(data)
      end

      # GET /api/v1/fragments/:id
      def show
        render_success(fragment_detail(@fragment))
      end

      # POST /api/v1/fragments
      def create
        content = params.require(:fragment).permit(:content, :title)[:content]
        title = params.dig(:fragment, :title)

        fragment = current_user.fragments.build(content: content, title: title)

        if fragment.save
          # The first content is the Seed. Owl quietly observes the initial seed.
          observation_text = Owl::OwlService.new(fragment: fragment).observe
          fragment.observations.create!(
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

      # PATCH /api/v1/fragments/:id/rename
      # Renames the display title only. NEVER touches the Seed content!
      def rename
        new_title = params.require(:fragment).permit(:title)[:title]
        if @fragment.update(title: new_title)
          render_success(fragment_detail(@fragment), "Fragment title updated.")
        else
          render_error(@fragment.errors.full_messages.to_sentence)
        end
      end

      # PATCH /api/v1/fragments/:id/archive
      def archive
        @fragment.archive!
        render_success(fragment_detail(@fragment), "Fragment archived.")
      end

      # PATCH /api/v1/fragments/:id/restore
      def restore
        @fragment.restore!
        render_success(fragment_detail(@fragment), "Fragment restored to active thinking space.")
      end

      # POST /api/v1/fragments/:id/share
      # Creates or returns a secure public link with readable slug + random token suffix
      def share
        @fragment.generate_share_link!
        render_success({
          share_token: @fragment.share_token,
          share_slug: @fragment.share_slug,
          shared_at: @fragment.shared_at,
          public_url: "/share/@#{current_user.username}/#{@fragment.share_slug}"
        }, "Public share link created.")
      end

      # DELETE /api/v1/fragments/:id/share
      def revoke_share
        @fragment.revoke_share_link!
        render_success({ id: @fragment.id, shared: false }, "Share link revoked.")
      end

      # DELETE /api/v1/fragments/:id
      # Permanently releases/deletes the fragment
      def destroy
        @fragment.destroy
        render_success({ id: @fragment.id }, "Fragment permanently released.")
      end

      private

      def set_fragment
        @fragment = current_user.fragments.find(params[:id])
      end

      def fragment_summary(fragment)
        observations = fragment.observations
        {
          id: fragment.id,
          title: fragment.title,
          display_title: fragment.display_title,
          seed: fragment.content,
          observations_count: observations.size,
          sparks_count: observations.count { |o| o.pinned? },
          archived: fragment.archived?,
          archived_at: fragment.archived_at,
          shared: fragment.shared?,
          share_slug: fragment.share_slug,
          created_at: fragment.created_at,
          updated_at: fragment.updated_at
        }
      end

      def fragment_detail(fragment)
        ordered_obs = fragment.observations.order(created_at: :asc)
        sparks = ordered_obs.select { |o| o.pinned? }

        {
          id: fragment.id,
          title: fragment.title,
          display_title: fragment.display_title,
          seed: fragment.content,
          archived: fragment.archived?,
          archived_at: fragment.archived_at,
          shared: fragment.shared?,
          share_slug: fragment.share_slug,
          share_token: fragment.share_token,
          shared_at: fragment.shared_at,
          public_url: fragment.shared? ? "/share/@#{fragment.user.username}/#{fragment.share_slug}" : nil,
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
          role: obs.role,
          content: obs.content,
          pinned: obs.pinned? || false,
          created_at: obs.created_at
        }
      end
    end
  end
end
