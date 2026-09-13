Rails.application.routes.draw do
  # Healthcheck
  get "/up", to: proc { [200, { "Content-Type" => "text/plain" }, ["OK"]] }

  # API Documentation & OpenAPI Specification
  get "/api/docs", to: "api/docs#index", as: :api_docs
  get "/api/openapi.json", to: "api/docs#openapi", as: :api_openapi

  # API v1 namespace for modern frontend / clients
  namespace :api do
    namespace :v1 do
      # Authentication
      post   "/auth/register",       to: "auth#register"
      post   "/auth/login",          to: "auth#login"
      delete "/auth/logout",         to: "auth#logout"
      get    "/auth/check-username", to: "auth#check_username"
      get    "/auth/check-email",    to: "auth#check_email"
      get    "/me",                  to: "auth#me"

      # Fragments & Seed
      resources :fragments, only: [ :index, :show, :create, :destroy ] do
        # Entries & Owl observations
        resources :entries, only: [ :create ], controller: "observations"
        post "owl/observe", to: "observations#observe"

        # Sparks
        resources :sparks, only: [ :index ]

        # Growth synthesis
        resource :growth, only: [ :show ], controller: "growth"
      end

      # Observations / Sparks actions
      post   "/observations/:id/spark", to: "sparks#pin"
      delete "/observations/:id/spark", to: "sparks#unpin"

      # User settings
      resource :settings, only: [ :show ] do
        patch :profile, to: "settings#update_profile"
        patch :password, to: "settings#update_password"
      end
    end
  end

  # Existing Rails HTML routes (preserved for backwards compatibility)
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
