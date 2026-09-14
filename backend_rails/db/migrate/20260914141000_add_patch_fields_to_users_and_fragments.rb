class AddPatchFieldsToUsersAndFragments < ActiveRecord::Migration[8.0]
  def change
    # User personalization, birthday, memory and instructions
    add_column :users, :preferred_name, :string
    add_column :users, :date_of_birth, :date
    add_column :users, :interests, :jsonb, default: []
    add_column :users, :owl_instructions, :text
    add_column :users, :use_memory, :boolean, default: true
    add_column :users, :seen_journey_milestones, :jsonb, default: []

    # Fragment display title, archive, and public sharing
    add_column :fragments, :title, :string
    add_column :fragments, :archived_at, :datetime
    add_column :fragments, :share_token, :string
    add_column :fragments, :share_slug, :string
    add_column :fragments, :shared_at, :datetime

    add_index :fragments, :archived_at
    add_index :fragments, :share_token, unique: true
  end
end
