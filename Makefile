PYTHON := python3
PIP := pip3

install:
	cd backend && $(PIP) install -r requirements.txt
	npm install
	npm run build

start:
	cd backend && bash start.sh

dev:
	cd backend && $(PYTHON) -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload

build-frontend:
	npm run build

update:
	chmod +x update_ollama_models.sh
	@./update_ollama_models.sh
	@git pull
	$(MAKE) install
