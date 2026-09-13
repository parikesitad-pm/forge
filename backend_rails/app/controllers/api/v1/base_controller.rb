module Api
  module V1
    class BaseController < ActionController::API
      include ActionController::Cookies

      before_action :require_login

      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

      private

      def current_user
        @current_user ||= User.find_by(id: session[:user_id])
      end

      def require_login
        return if current_user

        render json: {
          error: "Unauthorized",
          message: "Please sign in to continue thinking."
        }, status: :unauthorized
      end

      def render_success(data = {}, message = nil, status = :ok)
        payload = { success: true, data: data }
        payload[:message] = message if message.present?
        render json: payload, status: status
      end

      def render_error(message, status = :unprocessable_entity, details = nil)
        payload = { success: false, error: message }
        payload[:details] = details if details.present?
        render json: payload, status: status
      end

      def record_not_found(exception)
        render json: {
          success: false,
          error: "Not Found",
          message: exception.message
        }, status: :not_found
      end

      def record_invalid(exception)
        render json: {
          success: false,
          error: "Validation Failed",
          details: exception.record.errors.full_messages
        }, status: :unprocessable_entity
      end
    end
  end
end
