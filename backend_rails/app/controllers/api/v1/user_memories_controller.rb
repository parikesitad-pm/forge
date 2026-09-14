module Api
  module V1
    class UserMemoriesController < BaseController
      before_action :set_memory, only: [ :update, :destroy ]

      # GET /api/v1/memories
      def index
        memories = current_user.user_memories.recent
        render_success({
          use_memory: current_user.use_memory?,
          memories: memories.map { |m| memory_payload(m) }
        })
      end

      # POST /api/v1/memories
      def create
        memory = current_user.user_memories.build(memory_params)
        if memory.save
          render_success(memory_payload(memory), "Memory recorded.", :created)
        else
          render_error(memory.errors.full_messages.to_sentence)
        end
      end

      # PATCH/PUT /api/v1/memories/:id
      def update
        if @memory.update(memory_params)
          render_success(memory_payload(@memory), "Memory updated.")
        else
          render_error(@memory.errors.full_messages.to_sentence)
        end
      end

      # DELETE /api/v1/memories/:id
      def destroy
        @memory.destroy
        render_success({ id: @memory.id }, "Memory forgotten.")
      end

      # PATCH /api/v1/memories/toggle
      def toggle
        current_user.update!(use_memory: !current_user.use_memory?)
        render_success({ use_memory: current_user.use_memory? }, "Memory preference updated.")
      end

      private

      def set_memory
        @memory = current_user.user_memories.find(params[:id])
      end

      def memory_params
        params.require(:memory).permit(:title, :content, :source)
      end

      def memory_payload(m)
        {
          id: m.id,
          title: m.title,
          content: m.content,
          source: m.source,
          created_at: m.created_at,
          updated_at: m.updated_at
        }
      end
    end
  end
end
