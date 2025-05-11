from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from analitic import ModuleAnalitics
import uvicorn
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data_graph")
async def get_data_graph(
    start: str = None,
    end: str = None,
    inn: str = "7721663977",
    metrics: str = '{"participations": true, "wins": true}'
):
    parsed_metrics = json.loads(metrics)
    module_analitic = ModuleAnalitics(selected_supplier=[inn])
    return {"data": module_analitic.get_data_for_graphs(start, end, parsed_metrics)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
