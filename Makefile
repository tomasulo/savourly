.DEFAULT_GOAL := help

# ── Dev ────────────────────────────────────────────────────────────────────────

.PHONY: dev
dev: ## Start development server (http://localhost:3000)
	npm run dev

.PHONY: install
install: ## Install dependencies
	npm install

# ── Build & production ─────────────────────────────────────────────────────────

.PHONY: build
build: ## Production build (runs TypeScript check)
	npm run build

.PHONY: start
start: ## Start production server (run build first)
	npm run start

# ── Quality ────────────────────────────────────────────────────────────────────

.PHONY: lint
lint: ## Run ESLint
	npm run lint

.PHONY: test
test: ## Run unit tests in watch mode
	npm run test

.PHONY: test-run
test-run: ## Run unit tests once (CI mode)
	npm run test -- --run

.PHONY: test-coverage
test-coverage: ## Run unit tests with coverage report
	npm run test:coverage

.PHONY: test-e2e
test-e2e: ## Run Playwright E2E tests
	npm run test:e2e

.PHONY: test-e2e-ui
test-e2e-ui: ## Run Playwright E2E tests with UI
	npm run test:e2e:ui

.PHONY: check
check: lint test-run build ## Run lint + tests + build (full CI check)

# ── Deploy ─────────────────────────────────────────────────────────────────────

.PHONY: deploy
deploy: ## Deploy to Vercel (production)
	npx vercel --prod

.PHONY: deploy-preview
deploy-preview: ## Deploy preview to Vercel
	npx vercel

# ── Utilities ──────────────────────────────────────────────────────────────────

.PHONY: clean
clean: ## Remove build artifacts and caches
	rm -rf .next out

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
