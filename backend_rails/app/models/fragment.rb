class Fragment < ApplicationRecord
  belongs_to :user
  has_many :observations, dependent: :destroy

  validates :content, presence: true

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }

  def display_title
    title.presence || content.to_s.truncate(45)
  end

  def archived?
    archived_at.present?
  end

  def archive!
    update!(archived_at: Time.current)
  end

  def restore!
    update!(archived_at: nil)
  end

  def generate_share_link!
    base_slug = (title.presence || content.to_s.truncate(36)).parameterize
    base_slug = "thought" if base_slug.blank?
    random_token = SecureRandom.hex(4)
    update!(
      share_token: random_token,
      share_slug: "#{base_slug}-#{random_token}",
      shared_at: Time.current
    )
  end

  def revoke_share_link!
    update!(
      share_token: nil,
      share_slug: nil,
      shared_at: nil
    )
  end

  def shared?
    share_token.present? && share_slug.present?
  end
end
