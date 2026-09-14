class CreateUserMemories < ActiveRecord::Migration[8.0]
  def change
    create_table :user_memories do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content, null: false
      t.string :source, default: "explicit", null: false

      t.timestamps
    end

    add_index :user_memories, [ :user_id, :title ]
  end
end
