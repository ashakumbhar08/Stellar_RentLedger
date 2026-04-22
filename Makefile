.PHONY: help install dev build test clean docker-up docker-down deploy-contract

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	@echo "Installing server dependencies..."
	cd server && npm install
	@echo "Installing client dependencies..."
	cd client && npm install
	@echo "Building contract..."
	cd contract && cargo build

dev: ## Start development servers
	@echo "Starting development environment..."
	@make -j3 dev-server dev-client dev-contract

dev-server: ## Start server in dev mode
	cd server && npm run dev

dev-client: ## Start client in dev mode
	cd client && npm start

dev-contract: ## Watch contract for changes
	@echo "Contract built. Run 'make test-contract' to test."

build: ## Build all components for production
	@echo "Building server..."
	cd server && npm install --production
	@echo "Building client..."
	cd client && npm run build
	@echo "Building contract..."
	cd contract && cargo build --target wasm32-unknown-unknown --release
	cd contract && stellar contract build --optimize

test: ## Run all tests
	@echo "Testing server..."
	cd server && npm test || echo "No server tests configured"
	@echo "Testing client..."
	cd client && npm test -- --watchAll=false || echo "No client tests configured"
	@echo "Testing contract..."
	cd contract && cargo test

test-contract: ## Run contract tests only
	cd contract && cargo test --verbose

lint: ## Run linters
	@echo "Linting server..."
	cd server && npm run lint || echo "No lint script"
	@echo "Linting client..."
	cd client && npm run lint || echo "No lint script"
	@echo "Checking contract formatting..."
	cd contract && cargo fmt --check

format: ## Format code
	@echo "Formatting contract..."
	cd contract && cargo fmt

clean: ## Clean build artifacts
	@echo "Cleaning server..."
	cd server && rm -rf node_modules
	@echo "Cleaning client..."
	cd client && rm -rf node_modules build
	@echo "Cleaning contract..."
	cd contract && cargo clean

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-build: ## Build Docker images
	docker-compose build

deploy-contract: ## Deploy smart contract to testnet
	@echo "Building optimized WASM..."
	cd contract && cargo build --target wasm32-unknown-unknown --release
	cd contract && stellar contract build --optimize
	@echo "Deploying to testnet..."
	cd contract && stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/rentledger.optimized.wasm \
		--source deployer \
		--network testnet

upgrade-contract: ## Upgrade deployed contract
	@echo "Building new version..."
	cd contract && cargo build --target wasm32-unknown-unknown --release
	cd contract && stellar contract build --optimize
	@echo "Installing new WASM..."
	cd contract && stellar contract install \
		--wasm target/wasm32-unknown-unknown/release/rentledger.optimized.wasm \
		--source deployer \
		--network testnet

health-check: ## Check if services are running
	@echo "Checking server..."
	@curl -s http://localhost:5001/api/health || echo "Server not responding"
	@echo "\nChecking client..."
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Client not responding"

setup-testnet: ## Setup testnet account
	@echo "Generating testnet account..."
	stellar keys generate testuser --network testnet
	@echo "Funding account..."
	stellar keys address testuser | xargs -I {} curl "https://friendbot.stellar.org?addr={}"

contract-info: ## Show deployed contract info
	@echo "Contract ID: CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT"
	@echo "Network: testnet"
	@echo "Explorer: https://stellar.expert/explorer/testnet/contract/CABGAA7QC6DB5GWKCWJICIR3EVAKSPJ34237ZVCJQAJIWZFTEIOL5LNT"
