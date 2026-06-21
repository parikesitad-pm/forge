class SessionsController < ApplicationController
  def new
  end

  def create
    identifier = params[:identifier].to_s.downcase

    user = User.find_by(
      "lower(email) = ? OR lower(username) = ?",
      identifier,
      identifier
    )

    if user&.authenticate(params[:password])
      session[:user_id] = user.id

      redirect_to fragments_path
    else
      flash.now[:alert] = "Invalid credentials"

      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    reset_session

    redirect_to root_path
  end
end
