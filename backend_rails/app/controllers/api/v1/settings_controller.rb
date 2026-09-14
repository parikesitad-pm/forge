module Api
  module V1
    class SettingsController < BaseController
      def show
        render_success(user_payload(current_user))
      end

      def update_profile
        if params[:remove_avatar] == "true" || params.dig(:user, :remove_avatar) == "true"
          current_user.avatar.purge if current_user.avatar.attached?
        end

        # Handle interests array parsing if string received
        p_params = profile_params
        if p_params[:interests].is_a?(String)
          p_params[:interests] = JSON.parse(p_params[:interests]) rescue []
        end

        if current_user.update(p_params)
          render_success(user_payload(current_user), "Profile updated successfully.")
        else
          render_error(current_user.errors.full_messages.to_sentence, :unprocessable_entity, current_user.errors.messages)
        end
      end

      def update_password
        unless current_user.authenticate(params[:current_password])
          return render_error("Current password is incorrect.", :unprocessable_entity)
        end

        if current_user.update(
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        )
          render_success(user_payload(current_user), "Password updated successfully.")
        else
          render_error(current_user.errors.full_messages.to_sentence, :unprocessable_entity, current_user.errors.messages)
        end
      end

      # POST /api/v1/settings/journey_milestone
      # Persists seen journey milestone server-side
      def record_journey_milestone
        milestone = params.require(:milestone).to_s
        seen = Array(current_user.seen_journey_milestones)
        unless seen.include?(milestone)
          seen << milestone
          current_user.update!(seen_journey_milestones: seen)
        end
        render_success(user_payload(current_user), "Milestone recorded.")
      end

      # DELETE /api/v1/settings/account
      # Destructive permanent account deletion requiring explicit confirmation
      def destroy_account
        confirmation = params[:confirmation].to_s.strip
        password = params[:password].to_s

        unless confirmation == "DELETE"
          return render_error("Please type DELETE to confirm permanent account deletion.", :bad_request)
        end

        unless current_user.authenticate(password)
          return render_error("Incorrect password.", :unprocessable_entity)
        end

        user_id = current_user.id
        current_user.destroy
        session[:user_id] = nil

        render_success({ deleted_id: user_id }, "Account and all thoughts have been permanently deleted.")
      end

      private

      def profile_params
        params.require(:user).permit(
          :fullname,
          :username,
          :email,
          :bio,
          :preferred_name,
          :date_of_birth,
          :owl_instructions,
          :use_memory,
          :avatar,
          interests: []
        )
      end

      def user_payload(user)
        {
          id: user.id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          bio: user.bio,
          preferred_name: user.preferred_name,
          calling_name: user.display_calling_name,
          date_of_birth: user.date_of_birth&.iso8601,
          derived_age: user.derived_age,
          birthday_today: user.birthday_today?,
          interests: Array(user.interests),
          owl_instructions: user.owl_instructions,
          use_memory: user.use_memory?,
          seen_journey_milestones: Array(user.seen_journey_milestones),
          initials: user.initials,
          avatar_url: user.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: true) : nil,
          created_at: user.created_at
        }
      end
    end
  end
end
