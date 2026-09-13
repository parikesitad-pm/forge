require "test_helper"

class SettingControllerTest < ActionDispatch::IntegrationTest
  test "should redirect show when not logged in" do
    get settings_url
    assert_response :redirect
  end
end
