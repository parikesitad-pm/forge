class Observation < ApplicationRecord
  belongs_to :fragment

  enum :role, {
    ai: 0,
    user: 1
  }

  validates :content, presence: true
end
