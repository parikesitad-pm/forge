Rails.application.routes.draw do
  root "fragments#index"

  resources :fragments, only: [ :index, :new, :create ]
end
