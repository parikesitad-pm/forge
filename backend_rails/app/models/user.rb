class User < ApplicationRecord
  has_secure_password
  has_one_attached :avatar

  has_many :fragments, dependent: :destroy
  has_many :user_memories, dependent: :destroy

  def derived_age
    return nil unless date_of_birth.present?

    today = Date.current
    age = today.year - date_of_birth.year
    age -= 1 if today < date_of_birth + age.years
    age >= 0 ? age : nil
  end

  def birthday_today?
    return false unless date_of_birth.present?

    today = Date.current
    date_of_birth.month == today.month && date_of_birth.day == today.day
  end

  def display_calling_name
    preferred_name.presence || fullname.presence || username
  end

  def initials
    name = display_calling_name.to_s.strip
    parts = name.split(/\s+/)
    if parts.length >= 2
      "#{parts[0][0]}#{parts[1][0]}".upcase
    elsif name.length >= 2
      name[0..1].upcase
    elsif name.length == 1
      name[0].upcase
    else
      "TH"
    end
  end

  validates :username,
            presence: true,
            uniqueness: {
              message: "is already being used by another thinker"
            },
            length: {
              minimum: 3,
              message: "must be at least 3 characters long"
            }

  validates :email,
            presence: true,
            uniqueness: true,
            format: {
              with: URI::MailTo::EMAIL_REGEXP
            }

  validates :password,
            length: {
              minimum: 8,
              message: "must be at least 8 characters long"
            },
            format: {
              with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+\z/,
              message: "needs an uppercase letter, lowercase letter, number, and symbol"
            },
            if: -> { password.present? }
end
