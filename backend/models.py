from pydantic import BaseModel
from typing import Optional, List, Dict


class FilterModel(BaseModel):
    date_qs: Optional[Dict[str, str]] = None
    starting_price: Optional[Dict[str, str]] = None
    final_price: Optional[Dict[str, str]] = None
    quotation_sessions: Optional[List[str]] = None
    clients: Optional[List[str]] = None
    kpgz: Optional[List[str]] = None
    ste: Optional[List[str]] = None
    date_offer: Optional[Dict[str, str]] = None
    only_win: Optional[bool] = None

