class ObservationsController < ApplicationController
  def create
    @fragment = Fragment.find(params[:fragment_id])

    user_observation = @fragment.observations.create!(
      role: :user,
      content: observation_params[:content]
    )

    ai_response = GeminiService.new(
      fragment: @fragment,
      message: user_observation.content
    ).call

    @fragment.observations.create!(
      role: :ai,
      content: ai_response
    )

    redirect_to @fragment
  end

  def pin
    @fragment = current_user.fragments.find(params[:fragment_id])

    @observation = @fragment.observations.find(params[:id])

    @observation.update!(pinned: true)

    redirect_to @fragment,
      notice: "Spark created."
  end

  def unpin
    @fragment = current_user.fragments.find(params[:fragment_id])

    @observation = @fragment.observations.find(params[:id])

    @observation.update!(pinned: false)

    redirect_to @fragment,
      notice: "Spark removed."
  end

  private

  def observation_params
    params.require(:observation).permit(:content)
  end
end
