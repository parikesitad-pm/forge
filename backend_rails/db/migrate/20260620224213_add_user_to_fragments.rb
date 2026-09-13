class AddUserToFragments < ActiveRecord::Migration[8.0]
  def change
    add_reference :fragments,
                  :user,
                  foreign_key: true
  end
end
