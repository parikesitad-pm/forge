class CreateFragments < ActiveRecord::Migration[8.0]
  def change
    create_table :fragments do |t|
      t.text :content

      t.timestamps
    end
  end
end
