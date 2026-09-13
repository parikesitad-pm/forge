# frozen_string_literal: true

require "test_helper"

module Api
  class DocsControllerTest < ActionDispatch::IntegrationTest
    test "GET /api/docs renders swagger ui html successfully" do
      get api_docs_url
      assert_response :success
      assert_includes @response.body, "Forge API Reference"
      assert_includes @response.body, "SwaggerUIBundle"
    end

    test "GET /api/openapi.json returns valid openapi 3 specification" do
      get api_openapi_url
      assert_response :success
      json = JSON.parse(@response.body)
      assert_equal "3.0.3", json["openapi"]
      assert_equal "Forge API", json["info"]["title"]
      assert json["paths"].key?("/auth/login")
      assert json["paths"].key?("/fragments")
    end
  end
end
