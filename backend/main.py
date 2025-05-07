from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from analitic import ModuleAnalitics


app = FastAPI()

module_analitic = ModuleAnalitics()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test")
async def get_test():
    return {'message': 'test'}

@app.get("/data_graph")
async def get_data_graph():
    return {"data": module_analitic.get_data_for_graphs()}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)