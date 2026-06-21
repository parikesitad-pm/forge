class HomeController < ApplicationController
  def index
    if current_user
      redirect_to fragments_path
    end
  end
end
