require "test_helper"

module Api
  module V1
    class PatchFeaturesTest < ActionDispatch::IntegrationTest
      setup do
        @user = User.create!(
          username: "patch_thinker",
          email: "patch@modula.local",
          password: "Password123!",
          password_confirmation: "Password123!"
        )
        # Sign in
        post api_v1_auth_login_url, params: {
          identifier: "patch_thinker", password: "Password123!"
        }, as: :json
        assert_response :success
      end

      test "fragment lifecycle: create, rename title without modifying seed, archive, restore, and share" do
        # 1. Create Fragment
        post api_v1_fragments_url, params: {
          fragment: { content: "Original sacred seed thought" }
        }, as: :json
        assert_response :created
        frag_id = response.parsed_body.dig("data", "id")
        assert_equal "Original sacred seed thought", response.parsed_body.dig("data", "seed")

        # 2. Rename title MUST NOT modify the seed
        patch rename_api_v1_fragment_url(frag_id), params: {
          fragment: { title: "Refined Display Title" }
        }, as: :json
        assert_response :success
        rename_data = response.parsed_body["data"]
        assert_equal "Refined Display Title", rename_data["title"]
        assert_equal "Original sacred seed thought", rename_data["seed"]

        # 3. Active index excludes archived
        get api_v1_fragments_url, as: :json
        assert_response :success
        assert_equal 1, response.parsed_body["data"].size

        # 4. Archive fragment
        patch archive_api_v1_fragment_url(frag_id), as: :json
        assert_response :success
        assert response.parsed_body.dig("data", "archived")

        # Verify excluded from default index
        get api_v1_fragments_url, as: :json
        assert_response :success
        assert_equal 0, response.parsed_body["data"].size

        # Verify present in archived index
        get archived_api_v1_fragments_url, as: :json
        assert_response :success
        assert_equal 1, response.parsed_body["data"].size

        # 5. Restore fragment
        patch restore_api_v1_fragment_url(frag_id), as: :json
        assert_response :success
        assert_not response.parsed_body.dig("data", "archived")

        get api_v1_fragments_url, as: :json
        assert_equal 1, response.parsed_body["data"].size

        # 6. Share fragment
        post share_api_v1_fragment_url(frag_id), as: :json
        assert_response :success
        share_slug = response.parsed_body.dig("data", "share_slug")
        assert share_slug.present?

        # 7. Unauthenticated public access
        delete api_v1_auth_logout_url, as: :json
        get "/api/v1/share/patch_thinker/#{share_slug}", as: :json
        assert_response :success
        public_data = response.parsed_body["data"]
        assert_equal "Refined Display Title", public_data["title"]
        assert_equal "Original sacred seed thought", public_data["seed"]
        assert_equal "patch_thinker", public_data.dig("author", "username")

        # 8. Re-login & revoke share
        post api_v1_auth_login_url, params: {
          identifier: "patch_thinker", password: "Password123!"
        }, as: :json
        delete share_api_v1_fragment_url(frag_id), as: :json
        assert_response :success

        # Public access should now be 404
        delete api_v1_auth_logout_url, as: :json
        get "/api/v1/share/patch_thinker/#{share_slug}", as: :json
        assert_response :not_found
      end

      test "user memories: CRUD and toggle preference" do
        # 1. List empty memories
        get api_v1_memories_url, as: :json
        assert_response :success
        assert response.parsed_body.dig("data", "use_memory")
        assert_equal 0, response.parsed_body.dig("data", "memories").size

        # 2. Create memory
        post api_v1_memories_url, params: {
          memory: {
            title: "Songwriting",
            content: "Loves writing indie acoustic songs with guitar chords",
            source: "explicit"
          }
        }, as: :json
        assert_response :created
        mem_id = response.parsed_body.dig("data", "id")

        # 3. Toggle memory usage
        patch toggle_api_v1_memories_url, as: :json
        assert_response :success
        assert_equal false, response.parsed_body.dig("data", "use_memory")

        # 4. Delete memory
        delete api_v1_memory_url(mem_id), as: :json
        assert_response :success
      end

      test "user settings: date of birth and preferred name" do
        patch profile_api_v1_settings_url, params: {
          user: {
            preferred_name: "Awan",
            date_of_birth: "2000-05-15",
            interests: [ "Music", "Writing", "Technology" ],
            owl_instructions: "Keep observations poetic and musical"
          }
        }, as: :json
        assert_response :success
        user_data = response.parsed_body["data"]
        assert_equal "Awan", user_data["preferred_name"]
        assert_equal "Awan", user_data["calling_name"]
        assert_equal "2000-05-15", user_data["date_of_birth"]
        assert user_data["derived_age"].is_a?(Integer)
        assert_includes user_data["interests"], "Music"
      end
    end
  end
end
