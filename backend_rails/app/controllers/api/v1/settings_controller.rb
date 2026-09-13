module Api
  module V1
    class SettingsController < BaseController
      def show
        render_success(user_payload(current_user))
      end

      def update_profile
        if current_user.update(profile_params)
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

      private

      def profile_params
        params.require(:user).permit(:fullname, :username, :email, :bio, :avatar)
      end

      def user_payload(user)
        {
          id: user.id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          bio: user.bio,
          avatar_url: user.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: true) : nil,
          created_at: user.created_at
        }
      end
    end
  end
end
