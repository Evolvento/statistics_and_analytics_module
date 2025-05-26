from typing import Optional
from models import FilterModel
import pandas as pd
import ast
import numpy as np


class ModuleAnalitics():
    def __init__(self, selected_supplier = ['7721663977', 'ООО "КОМПЬЮЦЕНТР"', 'Москва г']):
        self.dataset = pd.read_csv("dataset.csv")
        # Выбранный поставщик
        self.selected_supplier = selected_supplier
        self.selected_inn = int(self.selected_supplier[0])

        self.dataset['Участники КС - поставщики'] = self.dataset['Участники КС - поставщики'].apply(
            lambda x: ast.literal_eval(x) if pd.notna(x) else None
        )

        self.dataset['Начало КС'] = pd.to_datetime(self.dataset['Начало КС'])
        self.dataset['Окончание КС'] = pd.to_datetime(self.dataset['Окончание КС'])

        # Подготовка метрик и данных нужных для графиков

        # Получение всех уникальных КС выбранного поставщика
        self.all_sessions = self.dataset[self.dataset['Участники КС - поставщики'].apply(lambda suppliers_list: self.selected_supplier in suppliers_list)].drop_duplicates(subset=['Id КС'])
        # Количество участий
        self.number_all_sessions = len(self.all_sessions)
        # Получение выигрышных КС
        self.winner_sessions = self.dataset[self.dataset['ИНН победителя КС'] == self.selected_inn].drop_duplicates(subset=['Id КС'])
        # Количество побед
        self.number_winner_sessions = len(self.winner_sessions)
        # Доля выигранных КС
        self.share_winnings = self.number_winner_sessions / self.number_all_sessions

        self.all_KPGZ = self.dataset[self.dataset['Участники КС - поставщики'].apply(lambda suppliers_list: selected_supplier in suppliers_list)]['Наименование СТЕ']


    def get_participation_wins(self, filters: Optional[FilterModel]):
        df_stats = self.dataset.copy()

        if filters:
            f = filters

            # Даты окончания КС
            if f.date_qs:
                if f.date_qs.get("start"):
                    df = df[df['Окончание КС'] >= pd.to_datetime(f.date_qs["start"])]
                if f.date_qs.get("end"):
                    df = df[df['Окончание КС'] <= pd.to_datetime(f.date_qs["end"])]

            # Даты действия оферты
            if f.date_offer:
                if f.date_offer.get("start"):
                    df = df[df['Дата начала действия оферты'] >= pd.to_datetime(f.date_offer["start"])]
                if f.date_offer.get("end"):
                    df = df[df['Дата окончания действия оферты'] <= pd.to_datetime(f.date_offer["end"])]

            # Цены
            if f.starting_price:
                if f.starting_price.get("min"):
                    df = df[df['Начальная цена'] >= float(f.starting_price["min"])]
                if f.starting_price.get("max"):
                    df = df[df['Начальная цена'] <= float(f.starting_price["max"])]

            if f.final_price:
                if f.final_price.get("min"):
                    df = df[df['Итоговая цена'] >= float(f.final_price["min"])]
                if f.final_price.get("max"):
                    df = df[df['Итоговая цена'] <= float(f.final_price["max"])]

            # Списочные поля
            if f.quotation_sessions:
                df = df[df['Id КС'].isin(f.quotation_sessions)]

            if f.clients:
                df = df[df['Наименование заказчика'].isin(f.clients)]

            if f.kpgz:
                df = df[df['Код КПГЗ'].isin(f.kpgz)]

            if f.ste:
                df = df[df['Наименование СТЕ'].isin(f.ste)]
                
        df_stats['Год-Месяц'] = df_stats['Окончание КС'].dt.to_period('M')

        monthly_all = df_stats[df_stats['Id КС'].isin(self.all_sessions['Id КС'])].drop_duplicates(subset=['Id КС']).groupby('Год-Месяц').size()
        monthly_wins = df_stats[df_stats['Id КС'].isin(self.winner_sessions['Id КС'])].drop_duplicates(subset=['Id КС']).groupby('Год-Месяц').size()

        result_df = pd.DataFrame({
            'Участия': monthly_all,
            'Победы': monthly_wins
        }).fillna(0).reset_index()

        result_df['Год-Месяц'] = result_df['Год-Месяц'].astype(str)

        return result_df
    
    def get_top_kpgz(self, filters: Optional[FilterModel]):
        df = self.dataset.copy()
        # Применяю те же фильтры, что и в get_participation_wins
        if filters:
            f = filters
            if f.kpgz:
                df = df[df['Код КПГЗ'].isin(f.kpgz)]
            if f.clients:
                df = df[df['Наименование заказчика'].isin(f.clients)]
            if f.quotation_sessions:
                df = df[df['Id КС'].isin(f.quotation_sessions)]
            if f.ste:
                df = df[df['Наименование СТЕ'].isin(f.ste)]
            if f.starting_price:
                if f.starting_price.get("min"):
                    df = df[df['Начальная цена'] >= float(f.starting_price["min"])]
                if f.starting_price.get("max"):
                    df = df[df['Начальная цена'] <= float(f.starting_price["max"])]
            if f.final_price:
                if f.final_price.get("min"):
                    df = df[df['Итоговая цена'] >= float(f.final_price["min"])]
                if f.final_price.get("max"):
                    df = df[df['Итоговая цена'] <= float(f.final_price["max"])]
            if f.date_qs:
                if f.date_qs.get("start"):
                    df = df[df['Окончание КС'] >= pd.to_datetime(f.date_qs["start"])]
                if f.date_qs.get("end"):
                    df = df[df['Окончание КС'] <= pd.to_datetime(f.date_qs["end"])]

        top_kpgz = df['Наименование КПГЗ'].value_counts().head(5)
        result = top_kpgz.reset_index()
        result.columns = ['Наименование КПГЗ', 'Количество']
        return result

    def get_qs(self):
        return self.dataset['Id КС'].head(10).dropna().astype(int).sort_values().unique().tolist()

    def get_clients(self):
        return self.dataset['Наименование заказчика'].head(10).dropna().astype(str).sort_values().unique().tolist()

    def get_kpgz(self):
        return self.dataset['Наименование КПГЗ'].head(10).dropna().astype(str).sort_values().unique().tolist()
    
    def get_ste(self):
        return self.dataset['Наименование СТЕ'].head(10).dropna().astype(str).sort_values().unique().tolist()




