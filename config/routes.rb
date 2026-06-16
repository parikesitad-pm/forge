Rails.application.routes.draw do
  resources :fragments, only: [ :index, :new, :create ]
end
