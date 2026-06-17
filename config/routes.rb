Rails.application.routes.draw do
  root "fragments#index"

  resources :fragments
end
