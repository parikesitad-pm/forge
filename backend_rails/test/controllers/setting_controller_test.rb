require "test_helper"

class SettingControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get setting_show_url
    assert_response :success
  end
end
