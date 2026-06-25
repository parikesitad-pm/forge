Rails.application.routes.draw do
  get "home/index"
  root "home#index"

  get "/register", to: "registrations#new"
  post "/register", to: "registrations#create"

  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"

  delete "/logout", to: "sessions#destroy"

  resources :fragments do
    resources :observations, only: [ :create ] do
      member do
        patch :pin
        patch :unpin
      end
    end
  end

  resource :settings, only: [ :show, :update ] do
    patch :password
  end
end
