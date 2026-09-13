class CreateObservations < ActiveRecord::Migration[8.0]
  def change
    create_table :observations do |t|
      t.references :fragment, null: false, foreign_key: true
      t.integer :role
      t.text :content
      t.boolean :pinned

      t.timestamps
    end
  end
end
