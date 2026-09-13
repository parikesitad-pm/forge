require "test_helper"

module Api
  module V1
    class AuthControllerTest < ActionDispatch::IntegrationTest
      test "check username availability" do
        get api_v1_auth_check_username_url, params: { username: "new_thinker_99" }, as: :json
        assert_response :success
        json = response.parsed_body
        assert json["available"]
      end

      test "register new user and login" do
        post api_v1_auth_register_url, params: {
          user: {
            username: "tester_owl",
            email: "owl@test.com",
            password: "Password123!",
            password_confirmation: "Password123!"
          }
        }, as: :json

        assert_response :created
        json = response.parsed_body
        assert json["success"]
        assert_equal "tester_owl", json.dig("data", "username")

        # Test /api/v1/me with the active session
        get api_v1_me_url, as: :json
        assert_response :success
        me_json = response.parsed_body
        assert_equal "tester_owl", me_json.dig("data", "username")

        # Test logout
        delete api_v1_auth_logout_url, as: :json
        assert_response :success

        # After logout, /me should be unauthorized
        get api_v1_me_url, as: :json
        assert_response :unauthorized
      end

      test "check email availability" do
        get api_v1_auth_check_email_url, params: { email: "completely_fresh_email@test.com" }, as: :json
        assert_response :success
        json = response.parsed_body
        assert json["available"]
      end
    end
  end
end
