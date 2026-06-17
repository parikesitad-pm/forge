class FragmentsController < ApplicationController
  def index
    @fragments = Fragment.order(created_at: :desc)
  end

  def show
    @fragment = Fragment.find(params[:id])
  end

  def new
    @fragment = Fragment.new
  end

  def create
    @fragment = Fragment.new(fragment_params)

    if @fragment.save
      redirect_to fragments_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def fragment_params
    params.require(:fragment).permit(:content)
  end
end
