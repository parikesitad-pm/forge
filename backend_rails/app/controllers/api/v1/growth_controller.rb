module Api
  module V1
    class GrowthController < BaseController
      def show
        fragment = current_user.fragments.find(params[:fragment_id])
        growth_data = Owl::OwlService.new(fragment: fragment).synthesize_growth

        render_success(growth_data)
      rescue StandardError => e
        Rails.logger.error("[Growth Error] #{e.message}")
        render_error("Unable to synthesize growth at this moment.")
      end
    end
  end
end
