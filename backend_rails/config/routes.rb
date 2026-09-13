Rails.application.routes.draw do
  get "home/index"
  root "home#index"

  get "/signup", to: "registrations#new"
  post "/signup", to: "registrations#create"

  get "/signin", to: "sessions#new"
  post "/signin", to: "sessions#create"

  delete "/signout", to: "sessions#destroy"

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
