class SettingsController < ApplicationController
  before_action :require_login

  def show
    @user = current_user
  end

  def update
    @user = current_user

    if @user.update(user_params)
      redirect_to settings_path, notice: "Profile updated successfully."
    else
      render :show, status: :unprocessable_entity
    end
  end

  def password
    @user = current_user

    unless @user.authenticate(params[:current_password])
      flash.now[:alert] = "Current password is incorrect."
      return render :show, status: :unprocessable_entity
    end

    if @user.update(
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
      redirect_to settings_path,
                  notice: "Password updated successfully."
    else
      render :show, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :fullname,
      :username,
      :email,
      :bio,
      :avatar
    )
  end
end
