# frozen_string_literal: true

module Api
  class DocsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    skip_before_action :require_login, raise: false

    # GET /api/docs
    def index
      render html: swagger_ui_html.html_safe, layout: false
    end

    # GET /api/openapi.json
    def openapi
      spec_path = Rails.root.join("public", "openapi.json")
      if File.exist?(spec_path)
        render file: spec_path, content_type: "application/json"
      else
        render json: { error: "OpenAPI specification not found" }, status: :not_found
      end
    end

    private

    def swagger_ui_html
      <<~HTML
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Forge API Reference · OpenAPI</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <style>
            html { box-sizing: border-box; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; background: #09090b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .swagger-ui .topbar { display: none; }
            .swagger-ui { background: #09090b; color: #f4f4f5; max-width: 1200px; margin: 0 auto; padding: 24px; }
            .swagger-ui .info .title { color: #f4f4f5; font-weight: 600; font-family: Georgia, serif; }
            .swagger-ui .info p, .swagger-ui .info li { color: #a1a1aa; }
            .swagger-ui .scheme-container { background: #18181b; box-shadow: none; border-bottom: 1px solid #27272a; border-radius: 8px; margin-bottom: 24px; }
            .swagger-ui .opblock { border-radius: 8px; border-color: #27272a; background: #121215; }
            .swagger-ui .opblock .opblock-summary { border-color: #27272a; }
            .swagger-ui .opblock .opblock-summary-method { border-radius: 6px; font-weight: 600; font-family: monospace; }
            .swagger-ui .opblock-tag { color: #f4f4f5; border-bottom: 1px solid #27272a; font-family: Georgia, serif; }
            .swagger-ui section.models { border-color: #27272a; border-radius: 8px; background: #121215; }
            .swagger-ui section.models h4 { color: #e4e4e7; }
            .swagger-ui .model-box { background: transparent; }
            .swagger-ui table thead tr th, .swagger-ui table thead tr td { color: #a1a1aa; border-color: #27272a; }
            .swagger-ui .response-col_status { color: #fafafa; }
            .swagger-ui input[type=text], .swagger-ui textarea { background: #18181b; color: #fafafa; border: 1px solid #3f3f46; border-radius: 6px; }
            .swagger-ui select { background: #18181b; color: #fafafa; border: 1px solid #3f3f46; }
            .swagger-ui .btn { border-radius: 6px; }
            .swagger-ui .opblock-description-wrapper p, .swagger-ui .opblock-external-docs-wrapper p, .swagger-ui .opblock-title_normal p { color: #a1a1aa; }
            .forge-header {
              padding: 16px 24px;
              background: #09090b;
              border-bottom: 1px solid #27272a;
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: sticky;
              top: 0;
              z-index: 50;
              backdrop-filter: blur(8px);
            }
            .forge-header h1 {
              font-size: 16px;
              font-weight: 600;
              margin: 0;
              color: #f4f4f5;
              letter-spacing: -0.01em;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .forge-header .badge {
              font-size: 11px;
              font-weight: 500;
              background: #27272a;
              color: #ec4899;
              padding: 2px 8px;
              border-radius: 9999px;
            }
            .forge-header a {
              color: #ec4899;
              font-size: 13px;
              text-decoration: none;
              font-family: monospace;
            }
            .forge-header a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="forge-header">
            <h1>Forge API Reference <span class="badge">OpenAPI 3.0</span></h1>
            <div style="display: flex; gap: 16px; align-items: center;">
              <a href="/docs" target="_blank">&larr; User Documentation</a>
              <a href="/api/openapi.json" target="_blank">Raw JSON ↗</a>
            </div>
          </div>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
          <script>
            window.onload = () => {
              window.ui = SwaggerUIBundle({
                url: '/api/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
                layout: "BaseLayout"
              });
            };
          </script>
        </body>
        </html>
      HTML
    end
  end
end
