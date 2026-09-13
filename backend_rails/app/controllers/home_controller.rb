class HomeController < PublicController
  def index
    redirect_to fragments_path if current_user
  end

  private
end
