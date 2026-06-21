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
    observation = Observation.find(params[:id])

    observation.update!(pinned: true)

    redirect_to observation.fragment
  end

  def unpin
    observation = Observation.find(params[:id])

    observation.update!(pinned: false)

    redirect_to observation.fragment
  end

  private

  def observation_params
    params.require(:observation).permit(:content)
  end
end
