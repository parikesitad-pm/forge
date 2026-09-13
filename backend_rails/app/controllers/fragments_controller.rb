class FragmentsController < WorkspaceController
  before_action :require_login

  def index
    @fragments = current_user.fragments.order(created_at: :desc)
  end

  def show
    @fragment = current_user.fragments.find(params[:id])
  end

  def new
    @fragment = Fragment.new
  end

  def create
  @fragment = current_user.fragments.build(fragment_params)

  if @fragment.save

    ai_response = GeminiService.new(
      fragment: @fragment,
      message: @fragment.content
    ).call

    @fragment.observations.create!(
      role: :ai,
      content: ai_response
    )

    redirect_to @fragment,
      notice: "Fragment created."

  else
      render :new,
        status: :unprocessable_entity
  end
  end

  private



  def fragment_params
    params.require(:fragment).permit(:content)
  end
end
