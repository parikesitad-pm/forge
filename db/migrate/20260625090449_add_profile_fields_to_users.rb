class AddProfileFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :fullname, :string
    add_column :users, :bio, :text
  end
end
