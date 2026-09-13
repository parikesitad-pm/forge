class Fragment < ApplicationRecord
  belongs_to :user
  has_many :observations, dependent: :destroy

  validates :content, presence: true
end
