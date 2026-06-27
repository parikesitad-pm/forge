class WorkspaceController < ApplicationController
  layout "workspace"

  before_action :require_login
end
