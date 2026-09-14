class UserMemory < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 120 }
  validates :content, presence: true, length: { maximum: 2000 }
  validates :source, inclusion: { in: %w[explicit profile confirmed] }

  scope :recent, -> { order(updated_at: :desc) }
end
