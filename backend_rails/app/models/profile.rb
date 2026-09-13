class Profile < ApplicationRecord
  validates :user_name, presence: true
  validates :owl_name, presence: true
  validates :owl_style, presence: true
end
