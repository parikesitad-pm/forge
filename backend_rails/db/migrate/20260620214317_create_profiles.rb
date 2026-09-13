class CreateProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :profiles do |t|
      t.string :user_name
      t.string :owl_name
      t.string :owl_style

      t.timestamps
    end
  end
end
