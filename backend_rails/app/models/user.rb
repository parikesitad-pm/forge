class User < ApplicationRecord
  has_secure_password
  has_one_attached :avatar

  has_many :fragments, dependent: :destroy

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
