from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from analitic import ModuleAnalitics


app = FastAPI()

module_analitic = ModuleAnalitics()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    uvicorn.run(app, host="0.0.0.0", port=8080)