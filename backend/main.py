from typing import Optional
from fastapi import FastAPI, Query, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from analitic import ModuleAnalitics
from models import FilterModel
from fastapi.responses import StreamingResponse
import uvicorn
import plotly.graph_objs as go
import plotly.utils
import pandas as pd
import json

app = FastAPI()

module_analitic = ModuleAnalitics()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/graph/participation-wins-json")
def get_participation_wins_plot(filters: FilterModel):
    data = module_analitic.get_participation_wins(filters)
    df = pd.DataFrame(data)

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df["Год-Месяц"], y=df["Участия"], mode='lines+markers', name='Участия'))
    fig.add_trace(go.Scatter(x=df["Год-Месяц"], y=df["Победы"], mode='lines+markers', name='Победы'))
    fig.update_layout(title="График побед и участий", xaxis_title="Месяц", yaxis_title="Количество")

    return JSONResponse(content=json.loads(json.dumps(fig.to_plotly_json(), cls=plotly.utils.PlotlyJSONEncoder)))

@app.post("/graph/top-kpgz-json")
def get_top_kpgz_plot(filters: FilterModel):
    top_kpgz_df = module_analitic.get_top_kpgz(filters)
    df = pd.DataFrame(top_kpgz_df)

    fig = go.Figure(
        data=[go.Pie(labels=df["Наименование КПГЗ"], values=df["Количество"], hole=0.4)],
        layout=go.Layout(title="Топ-5 популярных КПГЗ")
    )

    return JSONResponse(content=json.loads(json.dumps(fig.to_plotly_json(), cls=plotly.utils.PlotlyJSONEncoder)))

@app.get("/filter-options")
def get_filter_options():
    return JSONResponse(content={
        "quotation_sessions": module_analitic.get_qs(),
        "clients": module_analitic.get_clients(),
        "kpgz": module_analitic.get_kpgz(),
        "ste": module_analitic.get_ste()
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
