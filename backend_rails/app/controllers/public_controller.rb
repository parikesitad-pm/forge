class PublicController < ApplicationController
  layout "public"

  skip_before_action :require_login
end
