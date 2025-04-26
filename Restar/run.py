# run.py

import uvicorn
import logging

# Configure root logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting the FastAPI application...")
    # Run the FastAPI app using uvicorn and point to the 'app' instance in app.py
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

