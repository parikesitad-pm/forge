module Api
  module V1
    class AuthController < BaseController
      skip_before_action :require_login, only: [ :register, :login, :logout, :me, :check_username, :check_email ]

      def register
        user = User.new(user_params)

        if user.save
          session[:user_id] = user.id
          render_success(user_payload(user), "Welcome to Forge. Your thinking space is ready.", :created)
        else
          render_error(user.errors.full_messages.to_sentence, :unprocessable_entity, user.errors.messages)
        end
      end

      def login
        identifier = params[:identifier].to_s.strip.downcase

        user = User.find_by(
          "lower(email) = ? OR lower(username) = ?",
          identifier,
          identifier
        )

        if user&.authenticate(params[:password])
          session[:user_id] = user.id
          render_success(user_payload(user), "Welcome back, thinker.")
        else
          render_error("Invalid email/username or password.", :unauthorized)
        end
      end

      def logout
        reset_session
        cookies.delete(:_forge_session)
        render_success({}, "Signed out successfully.")
      end

      def me
        if current_user
          render_success(user_payload(current_user))
        else
          render json: { success: false, data: nil, message: "Not authenticated" }, status: :unauthorized
        end
      end

      def check_username
        username = params[:username].to_s.strip

        if username.length < 3
          render json: { available: false, message: "Username must be at least 3 characters" }
          return
        end

        exists = User.where("lower(username) = ?", username.downcase).exists?
        if exists
          render json: { available: false, message: "Username is already in use by another thinker" }
        else
          render json: { available: true, message: "Username is available" }
        end
      end

      def check_email
        email = params[:email].to_s.strip.downcase

        if email.blank? || !email.match?(URI::MailTo::EMAIL_REGEXP)
          render json: { available: false, message: "Enter a valid email address" }
          return
        end

        exists = User.where("lower(email) = ?", email).exists?
        if exists
          render json: { available: false, message: "Email is already registered" }
        else
          render json: { available: true, message: "Email is available" }
        end
      end

      private

      def user_params
        params.require(:user).permit(
          :username,
          :email,
          :password,
          :password_confirmation,
          :fullname,
          :bio
        )
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
